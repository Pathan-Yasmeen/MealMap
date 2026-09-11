let state={ };
const listeners=[];
export function getState(){
    return state;
}
export function setState(newState){
    state={
        ...state,
        ...newState
    };
    listeners.forEach((listener)=>{
        listener(state);
    });
}
export function subscribe(listener){
    listeners.push(listener);
}