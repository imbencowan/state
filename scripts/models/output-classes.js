import { sizeList } from '../constants.js';

//these are used to structure output for a state event, mostly in the form of pdfs

    // semantically define points on a pdf
export class Coord{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

    // this defines some structure for the page labels are printed on
const labelPage4 = {
	labels : 4,
	width : 215,
	height : 279,
	xMargin : 4,
	yMargin : 13,
	labelWidth : 101.6,
	labelHeight : 127,
	xCenter : 108,
	yCenter : 140,
	origins : [ new Coord(2, 14), new Coord(107.4, 14), new Coord(2, 140), new Coord(107.4, 140) ],
	padding : 6
}

    // i left this here in case we ever switch back to smaller labels
const labelPage6 = {
	labels : 6,
	width : 215,
	height : 279,
	xMargin : 4,
	yMargin : 13,
	labelWidth : 103,
	labelHeight : 85,
	xCenter : 108,
	yCenter : 140,
	origins : [
		new Coord(4, 13), new Coord(109, 13), new Coord(4, 98), new Coord(109, 98), new Coord(4, 183), new Coord(109, 183)
	],
	padding : 6
}

    // this sets which type of page we're printing labels on. importantly, it defines the origin of each label
export const labelPage = labelPage4;

// 	// this is used to provide shorter names for labels. indexes need to match sizeList
// const sizeListShort = ['S', 'M', 'L', 'XL', '2X', '3X', '4X', '5X'];

////////////////////////////////////////////////////////////////////////////////////////////////
// THE CLASSES
class MyPDF {
    constructor(doc) {
        this.doc = doc;
        this.width = 215.9;
        this.height = 280;
        this.alignX = 20;
        this.startY = 28;
        this.rMargin = this.width - this.alignX;
            // the start of each column. size columns are 11 wide
        this.colsX = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
            // which column we're on.
        this.col = 1;
        this.lineStep = 6.5;
        this.cursor = new Coord(this.alignX, this.startY);
        this.pageBreakY = this.height - 28;
        
        this.doc.setFontSize(10);
    }
    
    newLine(n = 1) {
        this.col = 1;
        this.cursor.x = this.alignX;
        this.cursor.y += (n * this.lineStep);
    }

    hr(x1, x2) {
        const y = this.cursor.y + 2;
        if (x1 === undefined) x1 = this.colsX[1];
        if (x2 === undefined) x2 = this.colsX[this.colsX.length - 1];

        this.doc.line(x1, y, x2, y);
    }
    
    addPage() {
        this.doc.addPage();
        this.col = 1;
        this.cursor.x = this.alignX;
        this.cursor.y = this.startY;
    }
    
    textToCell(txt, align = 'center', font = 'normal') {
        this.doc.setFont(undefined, font);

        if (typeof txt === 'number') txt = String(txt);
        if (!txt) txt = '';
        
        const colWidth = this.colsX[this.col + 1] - this.colsX[this.col];
        let x = this.colsX[this.col];
        let offset = ((colWidth - this.doc.getTextWidth(txt)) / 2);
        
        if (align == 'left') offset = 2;
        if (align == 'right') offset = (colWidth - 2 - this.doc.getTextWidth(txt));
        
        this.doc.text(String(txt), (x + offset), this.cursor.y);
        ++this.col;

            // unset font style
        this.doc.setFont(undefined, 'normal');
    }
}


export class Label {
    constructor(doc, originI, totalShirts, lblN = 1) {
        this.doc = doc;
        this.origin = labelPage.origins[originI];
        this.oX = this.origin.x;
        this.oY = this.origin.y;
        this.padding = 6;
        this.height = labelPage.labelHeight;
        this.width = labelPage.labelWidth;
        this.lineSpaces = [4.5, 7, 9];
        this.offsetX = 14;
        this.offsetY = 10;
        this.indentX = this.origin.x + this.offsetX + 3;
        this.alignX = this.origin.x + this.offsetX;
        this.gridX = this.origin.x + 38;
        this.gridStep = 8.5;
            // define where the cursor starts
        this.lineX = this.origin.x + this.offsetX;
        this.lineY = this.origin.y + this.offsetY;
        this.totalShirts = totalShirts;
        this.lblN = lblN;
            // use Math.max(1, ...) to make sure always = at least 1 label
        this.totalLabels = Math.max(1, Math.ceil(totalShirts / 26));
    }
    
    lineDown(step) {
        this.lineY += this.lineSpaces[step];
    }
    
    rectText(txt, color = '#000000', style = 'S') {
        this.doc.setDrawColor(color);
        this.doc.setFillColor(color);
        const txtWdth = this.doc.getTextWidth(txt);
        const txtHt = this.doc.getFontSize() / this.doc.internal.scaleFactor;
        this.doc.rect((this.lineX - 2), (this.lineY + 2), (txtWdth + 4), -(txtHt + 1.7), style);
        this.doc.text(txt, this.lineX, this.lineY);
        
            // unset colors
        this.doc.setDrawColor('#000000');
        this.doc.setFillColor('#000000');
    }
    
    centerTextInLabel(txt, color = null) {
        let txtWdth = this.doc.getTextWidth(txt);
        const txtHt = this.doc.getFontSize() / this.doc.internal.scaleFactor;
        let x = this.origin.x + ((this.width - txtWdth) / 2);
        if (color) {
            this.doc.setDrawColor(color);
            this.doc.setFillColor(color);
            this.doc.rect((x - 2), (this.lineY + 2), (txtWdth + 4), -(txtHt + 1.7), 'F');
        }
        this.doc.text(txt, x, this.lineY);
    }
    
    addSiteDivision(site, div) {
        this.doc.setFontSize(14);
        const txt = site + " - " + div;
        const txtWdth = this.doc.getTextWidth(txt);
        const y = this.origin.y + (this.height / 2) + (txtWdth / 2);
            // rotate this first line
        this.doc.text(txt, (this.origin.x + this.padding + 2), y, {angle: 90});
    }
    
    addGridSizes(min, max) {
        this.doc.setFontSize(12);
        let x = this.gridX;
            // forEach()?
        for (let i = min - 1; i < max; ++i) {
            this.centerInGrid(sizeList[i], x);
            x += this.gridStep;
        }
        this.centerInGrid("Total", x);
    }
    
    addGridQuantities(style, min, max) {
        this.doc.setFontSize(11);
        if (style.id !== 13) {
            style.sizes.forEach(size => {
                let x = this.gridX + this.gridStep * (size.id - min);
                this.centerInGrid(String(size.quantity), x);
            });
        }
        this.centerInGrid(String(style.getTotalQuantity()), (this.gridX + ((max - min + 1) * this.gridStep)));
    }
    
    centerInGrid(txt, x) {
        let txtWdth = this.doc.getTextWidth(txt);
        x += ((this.gridStep - txtWdth) / 2);
        this.doc.text(txt, x, this.lineY);
    }
    
    addBoxX() {
        this.doc.setFontSize(14);
        this.lineX = this.alignX + 64;
        this.lineY = this.origin.y + 72;
        this.rectText(`Box ${this.lblN}/${this.totalLabels}`, '#ff5844', 'F');
        this.lineX -= 64;
    }
    
    addBoxSymbol() {
        let boxTotal = this.totalShirts;
            // if this is the final label for a multi label order
        if ((this.lblN === this.totalLabels) && (this.totalLabels > 1)) boxTotal %= 26;
        const boxX = this.origin.x + 88;
        const boxY = this.origin.y + this.offsetY + 2;
        const boxW = 7;
        const boxH = 7;
            // && to accomodate modulus assigning 0
        if (boxTotal === 0) {
                // don't add a symbol to a blank order
            return;
        } else if (boxTotal < 3 && boxTotal > 0) {
            this.doc.line(boxX, boxY, boxX, (boxY - boxH));
            if (boxTotal > 1) this.doc.line((boxX + 1.5), boxY, (boxX + 1.5), (boxY - boxH));
        } else if (boxTotal < 20 && boxTotal > 0) {
                // mid size boxes, drawn sequentially as needed to represent s, m, l
            boxRect(this.doc, boxW, (boxH / 3));
            if (boxTotal > 6) boxRect(this.doc, boxW, (boxH * 2 / 3));
            if (boxTotal > 14) boxRect(this.doc, boxW, boxH);
        } else {
            const w = boxW * 1.3;
            boxRect(this.doc, w, boxH);
            this.doc.line(boxX, boxY, (boxX + w), (boxY - boxH));
            this.doc.line(boxX, (boxY - boxH), (boxX + w), boxY);
        }
        
        function boxRect(doc, w, h) {
            doc.rect(boxX, boxY, w, -h);
        }
    }
}

export class InvoicePage {
    constructor(doc) {
        this.doc = doc;
        this.width = 215.9;
        this.height = 280;
        this.alignX = 20;
        this.colsX = [0, 20, 60, 105, 140, 160, 175, 200];
        this.lineStep = 4;
        this.lineY = 30;
        
        this.doc.setFontSize(10);
    }
    
    lineDown(n = 1) {
        this.lineY += (n * this.lineStep);
    }
    
    centerTextInPage(txt) {
        let txtWdth = this.doc.getTextWidth(txt);
        let x = ((this.width - txtWdth) / 2);
        this.doc.text(txt, x, this.lineY);
    }
        
        // centers text in a box based off column values
    cell(txt, col, colSpan = 1, align = 'center') {
            // draw the box
        let bxWdth = this.colsX[col + colSpan] - this.colsX[col];
        this.doc.rect(this.colsX[col], (this.lineY + .85), bxWdth, -this.lineStep);
            // insert the text
        let txtWdth = this.doc.getTextWidth(String(txt));
            // default is offset to center
        let xOffset = ((bxWdth - txtWdth) / 2);
        if (align == 'left') {
            xOffset = 1;
        } else if (align == 'right') {
            xOffset = bxWdth - txtWdth - 1;
        }
        let x = this.colsX[col] + xOffset;
        this.doc.text(String(txt), x, this.lineY);
    }
    
    drawAddressBox() {
        const w = .9 * (this.colsX[3] - this.colsX[1]);
        const h = this.lineStep * 3;
        this.doc.rect(this.alignX - 1, this.lineY + 1, w, h);
    }
}

export class SoSPage extends MyPDF {
    constructor(doc) {
            // call parent constructor
        super(doc);
        // use the default page size and margins
        
            // the start of each column. size columns are 11 wide
        this.colsX = [0, 20, 28, 103, 114, 125, 136, 147, 158, 169, 180, 191, 202];
        this.lineStep = 6.5;
        
        this.doc.setFontSize(10);
    }
}

export class InventoryPage extends MyPDF {
    constructor(doc) {
            // call parent constructor
        super(doc);
        // use the default page size and margins
        
            // the start of each column. size columns are 15 wide
            // 0, item, style, color, S, M, L, XL, 2X, 3X, TOTAL, end
        this.colsX = [0, 20, 55, 71, 97, 112, 127, 142, 157, 172, 187, 202];
        this.sizelessCols = [1, 2, 10, 11];
        this.lineStep = 6;
        
        this.doc.setFontSize(10);
    }
}