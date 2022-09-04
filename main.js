const fs = require("fs");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
    let hotelRoomAll = []
    let availableRoom = []
    let notAvailableRoom = []
    let guestHotel ={}
    let keyCards = []
    let listGuest = []
  commands.forEach((command) => {
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params;
        for(let i = 1 ; i <= floor ; i++){
            for(let j = 1 ; j <= roomPerFloor ; j++){
                let iString = j.toString()
                if ( iString.length === 1  ) {
                    let iSplice = iString.padStart(2, "0")
                    hotelRoomAll.push([i] + iSplice)
                    availableRoom.push([i] + iSplice)
                }
            }
        }
        for(let i = 1 ; i <= hotelRoomAll.length ; i ++){
              keyCards.push(i)
        }
        console.log(`Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`)
        break;
        case "book" :
            keyCards.sort()
            const [guestRoom,guestName,guestAge] = command.params
            let guestRoomString = guestRoom.toString()
            if (notAvailableRoom.includes(guestRoomString)){
                console.log(`Cannot book room ${guestRoom} for ${guestName}, The room is currently booked by ${guestHotel[guestRoom]["guestName"]}.`)
                break
            }
            if(availableRoom.length > 0){
                    checkIn = availableRoom[availableRoom.indexOf(guestRoomString)]
                    availableRoom.splice(availableRoom.indexOf(guestRoomString), 1)
                    notAvailableRoom.push(checkIn)
            }

            guestHotel[checkIn] ={
            guestRoom : guestRoom,
            guestName :guestName,
            guestAge : guestAge,
                keyCards :  keyCards.shift(),
        }
            listGuest.push(guestName)
            console.log(`Room ${guestHotel[guestRoom]["guestRoom"]} is booked by ${guestHotel[guestRoom]["guestName"]} with keycard number ${guestHotel[guestRoom]["keyCards"]}.`)

        break;
        case "list_available_rooms" :
            console.log(`${availableRoom}`)
            break;
        case "checkout" :
            const [keyCard,guestNameCheckOut] = command.params
            for ( let key in guestHotel){
                if(guestHotel[key]["keyCards"] === keyCard && guestHotel[key]["guestName"] === guestNameCheckOut){
                    let guestHotelString =guestHotel[key]["guestRoom"].toString()
                    let checkOut = notAvailableRoom[notAvailableRoom.indexOf(guestHotelString)]
                    notAvailableRoom.splice(notAvailableRoom.indexOf(guestHotelString),1)
                    availableRoom.push(guestHotel[key]["guestRoom"])
                    keyCards.push(guestHotel[key]["keyCards"]);

                    let guestNameCheckOutString = guestNameCheckOut.toString()
                    listGuest.splice(listGuest.indexOf(guestNameCheckOutString),1)

                    delete guestHotel[key]

                    console.log(`Room ${checkOut} is checkout`)

                }else if (guestHotel[key]["keyCards"] === keyCard && guestHotel[key]["guestName"] !== guestNameCheckOut){
                    console.log(`Only ${guestHotel[key]["guestName"]} can checkout with keycard number ${guestHotel[key]["keyCards"]}.`)
                }
            }
            break;
        case "list_guest" :
            let newListGuest =  [...new Set(listGuest)]
            console.log(`${newListGuest}`)
            break;
        case "get_guest_in_room" :
            const [getGuestInRoom] = command.params
            console.log(guestHotel[getGuestInRoom]["guestName"])
            break;
        case "list_guest_by_age" :
            const [inequality,age] = command.params
            let GuestByAge = []
            for (let key in guestHotel){
                if(inequality === "<"){
                    if (guestHotel[key]["guestAge"] < age){
                        GuestByAge.push(guestHotel[key]["guestName"])
                    }
                }
                if(inequality === ">"){
                    if (guestHotel[key]["guestAge"] > age){
                        GuestByAge.push(guestHotel[key]["guestName"])
                    }
                }
            }
            console.log(`${GuestByAge}`)
            break;
        case "list_guest_by_floor" :
            const [GuestByFloor] = command.params
            let ListGuestByFloor = GuestByFloor * 100
            let endListGuestByFloor = (GuestByFloor+1) *100
            let guestFloor = [];
            for (let key in guestHotel){
                if( key > ListGuestByFloor  &&  key < endListGuestByFloor) {
                    guestFloor.push(guestHotel[key]["guestName"])
                }
            }
            console.log(`${guestFloor}`)
            break;
        case "checkout_guest_by_floor" :
            const [checkoutGuestByFloor] = command.params
            let StartCheckoutGuestByFloor = checkoutGuestByFloor * 100
            let endCheckoutGuestByFloor = (checkoutGuestByFloor+1) *100
            let outGuestByFloor = []
            let outGuestByRoom = []
            for (let key in guestHotel){
                if ( key > StartCheckoutGuestByFloor  && key < endCheckoutGuestByFloor){
                    outGuestByFloor.push([guestHotel[key]["keyCards"],guestHotel[key]["guestName"]])
                    outGuestByRoom.push(guestHotel[key]["guestRoom"])
                }
            }
            for(let i = 1  ; i <= outGuestByFloor.length ; i++){
                if(guestHotel[StartCheckoutGuestByFloor+i]["keyCards"] === outGuestByFloor[i-1][0] && guestHotel[StartCheckoutGuestByFloor+i]["guestName"] === outGuestByFloor[i - 1][1]){
                    notAvailableRoom.splice(notAvailableRoom.indexOf(guestHotel[StartCheckoutGuestByFloor + i]["guestRoom"],1))
                    availableRoom.push(guestHotel[StartCheckoutGuestByFloor + i]["guestRoom"])
                    keyCards.push(guestHotel[StartCheckoutGuestByFloor + i]["keyCards"])

                    delete guestHotel[StartCheckoutGuestByFloor + i]
                }
            }
            console.log(`Room ${outGuestByRoom} are checkout.`)
            break;
        case "book_by_floor" :

            const [bookFloor,bookName,bookAge]= command.params
            keyCards.sort()
            availableRoom.sort()
            let count = 0
            let roomByFloor = []
            let keyCardRoombyFloor = []
            let checkInHotel = []
            availableRoom.map(room =>{
                if(room > bookFloor*100 && room < (bookFloor+1)*100 ){
                    count++
                    roomByFloor.push(room)
                }
            })
            if( count === 3){
                for( let i = 0 ; i < count ; i++){
                    let checkInByFloor = availableRoom[availableRoom.indexOf(roomByFloor[i])]
                    checkInHotel.push(checkInByFloor)
                    availableRoom.splice(availableRoom.indexOf(roomByFloor[i]),1)
                    notAvailableRoom.push(checkInByFloor)
                    keyCardRoombyFloor.push(keyCards.shift())

                }
                console.log(`Room ${roomByFloor} are booked with keycard number ${keyCardRoombyFloor} `)
            }else{
                console.log(`Cannot book floor ${bookFloor} for ${bookName}.`)
                break
            }
            for (let i = 0 ; i < count ; i++){
                guestHotel[checkInHotel[i]] = {
                    guestRoom : checkInHotel[i],
                    guestName :bookName,
                    guestAge : bookAge,
                    keyCards :  keyCardRoombyFloor[i],
                }
            }

            break;
        default :
            break;

    }
  });

}


function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);
            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );

}

main();


