const ListKandidat = async function(kandidats) {
    
    let rows = [];
    
    for(var i = 0; i<kandidats.length; i++) {
        let toAppends = {
            title: kandidats[i].name,
            rowId: "detail_" + kandidats[i].id,
            description: kandidats[i].visi
        }

        rows.push(toAppends);
    
    };


    return [
        {
            title: "List kandidat",
            rows: rows
        }
    ];

}

const Konfirmasi = async function(nis, userNumber) {

    return [
        {
            title: "Konfirmasi disini",
            rows: [
                {title: "Yes", rowId: "confirm_" + nis + "_" + userNumber, description: "Data benar"},
                {title: "No", rowId: "reject_" + nis + "_" + userNumber, description: "Data salah"}
            ]
        }
    ];
    
}

const ConfirmVote = async function(kandidat_id) {
    return [
        {
            title: "Detail kandidat",
            rows: [
                {title: "Yes", rowId: "vote_" + kandidat_id, description: "Vote kandidat ini"},
                {title: "No", rowId: "cancel_" + kandidat_id, description: "Batal Vote"}
            ]
        }
    ];
}
module.exports = { ListKandidat, Konfirmasi, ConfirmVote }