let data =
[
    Command ={ name: 'create_hotel', params: [ 2, 3 ] },
    Command ={ name: 'book', params: [ 203, 'Thor', 32 ] },
    Command ={ name: 'book', params: [ 101, 'PeterParker', 16 ] },
    Command ={ name: 'book', params: [ 102, 'StephenStrange', 36 ] },
    Command ={ name: 'book', params: [ 201, 'TonyStark', 48 ] },
    Command ={ name: 'book', params: [ 202, 'TonyStark', 48 ] },
    Command ={ name: 'book', params: [ 203, 'TonyStark', 48 ] },
    Command ={ name: 'list_available_rooms', params: [] },
    Command ={ name: 'checkout', params: [ 4, 'TonyStark' ] },
    Command ={ name: 'book', params: [ 103, 'TonyStark', 48 ] },
    Command ={ name: 'book', params: [ 101, 'Thanos', 65 ] },
    Command ={ name: 'checkout', params: [ 1, 'TonyStark' ] },
    Command ={ name: 'checkout', params: [ 5, 'TonyStark' ] },
    Command ={ name: 'checkout', params: [ 4, 'TonyStark' ] },
    Command ={ name: 'list_guest', params: [] },
    Command ={ name: 'get_guest_in_room', params: [ 203 ] },
    Command ={ name: 'list_guest_by_age', params: [ '<', 18 ] },
    Command ={ name: 'list_guest_by_floor', params: [ 2 ] },
    Command ={ name: 'checkout_guest_by_floor', params: [ 1 ] },
    Command ={ name: 'book_by_floor', params: [ 1, 'TonyStark', 48 ] },
    Command ={ name: 'book_by_floor', params: [ 2, 'TonyStark', 48 ] },
    Command ={ name: '', params: [] }
]

let guestRoom = {}
let listguest = []
let keyCardsAll = []
let hotel = []
let availableRoom = []
let notAvailableRoom = []

function keyCard(input){
    for( let i = 1 ; i <= input ; i++){
        keyCardsAll.push(i)
    }
}

function createRoom(inputFloor,inputNumber) {
    for( let i = 1 ; i <= inputFloor;i++){
        for( let j = 1 ; j <= inputNumber;j++){
            let jString = j.toString()
             if(jString.length == 1){
                jString = jString.padStart(2,"0")
             }
            hotel.push(parseInt([i]+[jString]))
            availableRoom.push(parseInt([i]+[jString]))
        }
     }
    keyCard(hotel.length)
    return `Hotel created with ${inputFloor} floor(s), ${inputNumber} room(s) per floor.`
}

function checkAvailableRoom(inputCheckAvailableRoom){
    if(notAvailableRoom.includes(inputCheckAvailableRoom[0])){
        return `Cannot book room ${inputCheckAvailableRoom[0]} for ${inputCheckAvailableRoom[1]}, The room is currently booked by ${guestRoom[inputCheckAvailableRoom[0]]["guestName"]}.`
    }
    if(availableRoom.length > 0){
        if(availableRoom.includes(inputCheckAvailableRoom[0])){
            return checkin(inputCheckAvailableRoom)
        }
    }else{
        return "no room"
    }
}

function checkin(inputHotel){
    keyCardsAll.sort()
    availableRoom.sort()
    let booked ;
        booked = availableRoom[availableRoom.indexOf(inputHotel[0])]
        availableRoom.splice(availableRoom.indexOf(inputHotel[0]),1)
        notAvailableRoom.push(booked);


    guestRoom[booked] ={
        guestName : inputHotel[1],
        guestAge : inputHotel[2],
        keyCards :  keyCardsAll.shift(),
        roomNumber : booked

    }

    listguest.push(inputHotel[1])
    return `Room ${guestRoom[booked]["roomNumber"]} is booked by ${guestRoom[booked]["guestName"]} with keycard number ${guestRoom[booked]["keyCards"]}.`
}

function checkout(Checkout){
    for ( let key in guestRoom) {
        if(guestRoom[key]["keyCards"] === Checkout[0] && guestRoom[key]["guestName"] === Checkout[1]){
            let returnRoom = notAvailableRoom[notAvailableRoom.indexOf(guestRoom[key]["roomNumber"])]
            notAvailableRoom.splice(notAvailableRoom.indexOf(guestRoom[key]["roomNumber"]),1)
            availableRoom.push(guestRoom[key]["roomNumber"])
            keyCardsAll.push(guestRoom[key]["keyCards"]);

            listguest.splice(listguest.indexOf(guestRoom[key]["guestName"]),1)

            delete guestRoom[key]

            return `Room ${returnRoom} is checkout`

        }else if (guestRoom[key]["keyCards"] === Checkout[0] && guestRoom[key]["guestName"] !== Checkout[1]){
            return `Only ${guestRoom[key]["guestName"]} can checkout with keycard number ${guestRoom[key]["keyCards"]}.`
        }
    }

}

function getGuestInRoom(inputGetGuestInRoom){
    return guestRoom[inputGetGuestInRoom]["guestName"]
}

function listGuestByAge(inputListGuestByAge){
    let GuestByAge = []
    let age = inputListGuestByAge[1]
    for (key in guestRoom){
        if (inputListGuestByAge[0] === "<" ){
            if (guestRoom[key]["guestAge"] < age){
                GuestByAge.push(guestRoom[key]["guestName"])
            }
        }
        if (inputListGuestByAge[0] === ">" ){
            if (guestRoom[key]["guestAge"] > age){
                GuestByAge.push(guestRoom[key]["guestName"])
            }
        }

    }
    return `${GuestByAge}`
}

function listGuestByFloor(inputListGuestByFloor){
    let ListGuestByFloor = inputListGuestByFloor[0] * 100
    let endListGuestByFloor = (inputListGuestByFloor[0]+1) *100

    let GuestByFloor = [];
    for (key in guestRoom){
       if( key > ListGuestByFloor  && key < endListGuestByFloor) {
           GuestByFloor.push(guestRoom[key]["guestName"])
       }
    }
    return `${GuestByFloor}`
}

function checkoutGuestByFloor(inputCheckoutGuestByFloor){
    let CheckoutGuestByFloor = inputCheckoutGuestByFloor[0] * 100
    let endCheckoutGuestByFloor = (inputCheckoutGuestByFloor[0]+1) *100
    let outGuestByFloor = []
    let outGuestRoom = []
    for (key in guestRoom){
        if ( key > CheckoutGuestByFloor  && key < endCheckoutGuestByFloor){
            outGuestByFloor.push([guestRoom[key]["keyCards"],guestRoom[key]["guestName"]])
            outGuestRoom.push(guestRoom[key]["roomNumber"])
        }
    }
    for ( let i=1  ; i <= outGuestByFloor.length ; i++) {
        if (guestRoom[CheckoutGuestByFloor + i]["keyCards"] === outGuestByFloor[i - 1][0] && guestRoom[CheckoutGuestByFloor + i]["guestName"] === outGuestByFloor[i - 1][1]) {
            let returnRoom = notAvailableRoom[notAvailableRoom.indexOf(guestRoom[CheckoutGuestByFloor + i]["roomNumber"])]
            notAvailableRoom.splice(notAvailableRoom.indexOf(guestRoom[CheckoutGuestByFloor + i]["roomNumber"]), 1)
            availableRoom.push(guestRoom[CheckoutGuestByFloor + i]["roomNumber"])
            keyCardsAll.push(guestRoom[CheckoutGuestByFloor + i]["keyCards"]);

            delete guestRoom[CheckoutGuestByFloor + i]
        }

    }
    return `Room ${outGuestRoom} are checkout.`
}

function bookByFloor(inputBookByFloor){
    keyCardsAll.sort()
    availableRoom.sort()
    let count = 0
    let RoombyFloor = []
    let keyCardRoombyFloor = []
        availableRoom.map(room =>{
            if (room > inputBookByFloor[0]*100 && room < (inputBookByFloor[0]+1)*100){
                count++
                RoombyFloor.push(room)
            }
    })
        if(count === 3 ){
            for(let i = 0 ; i < count ; i++){
                let bookedByFloor
                bookedByFloor = availableRoom[availableRoom.indexOf(RoombyFloor[i])]
                availableRoom.splice(availableRoom.indexOf(RoombyFloor[i]),1)
                notAvailableRoom.push(bookedByFloor);
                keyCardRoombyFloor.push(keyCardsAll.shift())
            }
            return `Room ${RoombyFloor} are booked with keycard number ${keyCardRoombyFloor} `
       }else{
            return `Cannot book floor ${inputBookByFloor[0]} for ${inputBookByFloor[1]}.`
        }

}

function menu (data) {
    console.log(createRoom(data[0]["params"][0],data[0]["params"][1]))
    for (let key of data) {
        switch (Object.values(key)[0]) {
            case "book" :
                console.log(checkAvailableRoom(Object.values(key)[1]))
                break;
            case "list_available_rooms" :
                console.log(`${availableRoom}`)
                break;
            case "checkout" :
                console.log(checkout(Object.values(key)[1]))
                break;
            case "list_guest" :
                let newListguest =  [...new Set(listguest)]
                console.log(`${newListguest}`)
                break;
            case "get_guest_in_room" :
                console.log(getGuestInRoom(Object.values(key)[1]))
                break;
            case "list_guest_by_age" :
                console.log(listGuestByAge(Object.values(key)[1]))
                break;
            case "list_guest_by_floor" :
                console.log(listGuestByFloor(Object.values(key)[1]))
                break;
            case "checkout_guest_by_floor" :
                console.log(checkoutGuestByFloor(Object.values(key)[1]))
                break;
            case "book_by_floor" :
                console.log(bookByFloor(Object.values(key)[1]))
                break;


            default :
                break;
        }
    }

}

menu(data)

