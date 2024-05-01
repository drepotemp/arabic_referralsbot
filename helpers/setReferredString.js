const setReferredString = (referred)=>{
    switch (referred){
        case 0:
             return `Nobody`;
        case 1:
            return `1 person`;
    }

    if(referred > 1) return `${referred} people`
}

module.exports = setReferredString