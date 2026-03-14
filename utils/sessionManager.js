const sessions = {}

function getSession(number){

if(!sessions[number]){

sessions[number] = {
stage:"MAIN_MENU",
timer:null
}

}

return sessions[number]

}

function resetSession(number){
delete sessions[number]
}

module.exports = { getSession, resetSession }
