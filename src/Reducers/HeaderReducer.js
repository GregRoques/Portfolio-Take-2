export default function(state = 'Software Developer', action){
    if(action.type==='CHANGE_HEADER'){
        return action.payload;
    }else{
        return state;
    }

    }