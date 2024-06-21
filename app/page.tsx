'use client'

import { useState, useEffect } from "react";
import fetchGuestData, { GuestData } from "@/services/fetchGuestData";
import InputNumber from "@/components/InputNumber";
import ReactLoading from 'react-loading';

export default function Home() {
  const [ guest, setGuest] = useState<GuestData["guest"]>({
    adult: 0,
    child: 0
  });
  const [ rooms, setRooms] = useState<GuestData["rooms"]>([]);

  const getGuestData = () => {
    const { guest, rooms } = fetchGuestData();
    setGuest(guest);
    setRooms(rooms);
  };

  useEffect(() => {
    getGuestData();
  }, []);

  return (
    <main className="flex justify-center items-center h-screen">
      {guest.adult + guest.child + rooms.length > 0 ?
        <RoomAllocation
          guest={guest}
          rooms={rooms}
          onChange={result => console.log(result)}
        /> :
        <ReactLoading type={'bubbles'} color={'rgb(103 232 249)'} height={'50px'} width={'100px'} />
      }
    </main>
  );
}

interface IProps {  
  guest: GuestData["guest"],
  rooms: GuestData["rooms"],
  onChange: (results: { adult: number, child: number, price: number }) => void
}

function RoomAllocation({ guest, rooms, onChange }: IProps) {
  const [ roomMap, setRoomMap ] = useState<{ adult: number, child: number, price: number }>({ adult: 0, child: 0, price: 0 });

  const getDefaultRoomAllocation = () => {
    const results = [];
    // const backtracking = (adultLeft: number, childLeft: number, roomLeft: number, solution: { adult: number, child: number, price: number }[]) => {
    //   if ((adultLeft + childLeft < 0) || roomLeft < 0) return;
    //   if (adultLeft + childLeft + roomLeft === 0) return results.push([...solution]);
    //   for (let i = 0; i < rooms.length; i++) {
    //     solution.push();
    //     backtracking(guest.adult, guest.child, rooms.length, []);
    //     solution.pop();
    //   }
    // };
    // backtracking(guest.adult, guest.child, rooms.length, []);
  };

  useEffect(() => {
    const defaultRooms = getDefaultRoomAllocation();
    // const totalPrice = defaultRooms.reduce((acc, val) => acc + val.price, 0);
  }, []);

  return (
    <div className="w-96 lg:h-500 p-3">
      <div className="text-xl font-extrabold">
        {`住客人數: ${guest.adult} 位大人，${guest.child} 位小孩 / ${rooms.length} 房`}
        </div>
      <div className="bg-cyan-50 w-full border border-cyan-300 rounded-md p-5 mt-5 mb-2">
        <div className="text-base text-neutral-500">
          {`尚未分配人數: ${guest.adult} 位大人，${guest.child} 位小孩`}
        </div>
      </div>
      <div className="overflow-y-auto lg:h-340">
        {rooms.map((room, index) => (
          <div 
            key={`room-${index}`} 
            className="p-2"
            style={{borderBottom: index !== rooms.length - 1 ? '1px solid #ddd' : 'none'}}
          >
            <div className="text-lg font-semibold">
              {`房間: ${index} 人`}
            </div>
            <div className="flex justify-between items-center text-base mt-2 mb-4">
              <div>
                <div>大人</div>
                <div className="text-gray-400">年齡 20+</div>
              </div>
              <InputNumber 
                min={0}
                max={100}
                step={1}
                name={`room-${index}`}
                value={index}
                onChange={(e)=>console.log(e.target.value)}
                // onBlur={(e)=>onBlur(e)}
                // disabled={disabled}
              />
            </div>
            <div className="flex justify-between items-center text-base mt-2 mb-4">
                <div>小孩</div>
                <InputNumber 
                  min={0}
                  max={100}
                  step={1}
                  name={`room-${index}`}
                  value={index}
                  onChange={(e)=>console.log(e.target.value)}
                  // onBlur={(e)=>onBlur(e)}
                  // disabled={disabled}
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
