<?php
class MailAccess {
	private static $imapServer = 'mcusports-com.e.valice.com';
    private static $imapPort = 993;
    private static $email = 'ben@mcusports.com';
    private static $password = '456!Thm%Wx';

	private function __construct() {}

    public static function getMailBox() {
        $mailbox = sprintf('{%s:%d/imap/ssl}INBOX', self::$imapServer, self::$imapPort);

        $connection = @imap_open($mailbox, self::$email, self::$password);

        if ($connection === false) {
            $msg = 'Connection failed:<br>';
            echo htmlspecialchars(imap_last_error());
            exit;
        }

        return $connection;
    }
	

    public static function getEmailOrders() {
        $saveFolder = getenv('USERPROFILE') . '\\Documents\\IHSAAorders';
        if (!is_dir($saveFolder)) mkdir($saveFolder, 0777, true);

        $sender = 'admin@idhsaa.org';
        $mailbox = self::getMailBox();
        
        $emailIDs = imap_search($mailbox, 'UNSEEN FROM "' . $sender . '"');

        $results = [];

        if ($emailIDs !== false) {
            foreach ($emailIDs as $emailID) {
                $structure = imap_fetchstructure($mailbox, $emailID);
                $attachments = self::getTextAttachments($mailbox, $emailID, $structure);
                
                foreach ($attachments as &$a) {
                    if ($a['filename'] === 'roster.txt') {
                        $milliseconds = (int) ((microtime(true) - floor(microtime(true))) * 1000);
                        $a['filename'] = 'roster - ' . date('Y-m-d_His') . '_' . sprintf('%03d', $milliseconds) . '.txt';
                    }

                    file_put_contents($saveFolder . '\\' . $a['filename'], $a['content']);
                }

                $submitter = null;
                $header = imap_headerinfo($mailbox, $emailID);
                if (!empty($header->cc)) $submitter = $header->cc[0]->mailbox . '@' . $header->cc[0]->host;

                if (!empty($attachments)) $results[] = [ 'id' => $emailID, 'submitter' => $submitter, 'attachments' => $attachments ];
            }
        }

        imap_clearflag_full($mailbox, implode(',', $emailIDs), '\\Seen');

        imap_close($mailbox);

        return $results;
    }


        // $partNumber is used to specify part of an email, in this case the text attachment. It is a string corresponding to the email structure.
    private static function getTextAttachments($mailbox, $emailID, $structure, $partNumber = '') {
        $attachments = [];

        if (!empty($structure->parts)) {
            foreach ($structure->parts as $index => $part) {
                $currentPartNumber = ($partNumber === '') ? (string)($index + 1) : $partNumber . '.' . ($index + 1);

                $filename = '';

                if (!empty($part->dparameters)) {
                    foreach ($part->dparameters as $parameter) {
                        if (strtolower($parameter->attribute) === 'filename') $filename = $parameter->value;
                    }
                }

                if ($filename !== '' && strtolower(pathinfo($filename, PATHINFO_EXTENSION)) === 'txt') {
                        // FT_PEEK flag is used to fetch the body without marking the message as read
                    $content = imap_fetchbody($mailbox, $emailID, $currentPartNumber, FT_PEEK);

                    if ($part->encoding === 3) {
                        $content = base64_decode($content);
                    } elseif ($part->encoding === 4) {
                        $content = quoted_printable_decode($content);
                    }

                    $attachments[] = ['filename' => $filename, 'content' => $content];
                }

                if (!empty($part->parts)) {
                    $attachments = array_merge(
                        $attachments,
                        self::getTextAttachments($mailbox, $emailID, $part, $currentPartNumber)
                    );
                }
            }
        }

        return $attachments;
    }


    public static function markEmailsRead($emailIDs) {
        $mailbox = self::getMailBox();

        foreach ($emailIDs as $emailID) {
            imap_setflag_full($mailbox, $emailID, '\\Seen');
        }

        imap_close($mailbox);

        return true;
    }
}
?>