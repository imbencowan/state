//////////////////////////////////////////////////////////////////////////
// don't import db-classes here


    // takes an Array of Divisions, returns a string for display
export function getDivisionsString(divisions, gender = null) {
    if (!divisions || divisions.length === 0) return '';

        // create a map of id -> name (also removes duplicates)
    const divs = new Map(divisions.map(div => [ div.id, div.name ]));

    const ids = [...divs.keys()].sort((a, b) => a - b);

    let divStr;

    if (ids.length === 1) {
        divStr = divs.get(ids[0]);
    } else {
        const minId = ids[0];
        const maxId = ids[ids.length - 1];

        if ((maxId - minId + 1) === ids.length && ids.length > 2) {
        divStr = `${divs.get(minId)} - ${divs.get(maxId)}`;
        } else {
        divStr = ids
            .map(id => divs.get(id))
            .sort()
            .join(' / ');
        }
    }

    if (gender && gender.id !== 3) divStr += ' ' + gender.name;

    return divStr;
}