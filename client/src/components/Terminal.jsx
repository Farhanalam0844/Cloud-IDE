import React, { useEffect, useRef } from 'react'
import {Terminal as XTerminal} from '@xterm/xterm'
import socket from '../socket';
import '@xterm/xterm/css/xterm.css'

export default function Terminal() {
    const TerminalRef=useRef();

    useEffect(()=>{

        const term = new XTerminal({
            rows:20,
        })
        term.onData(data=>{
            socket.emit("terminal:write",data)
        })
        socket.on("terminal:data",(data)=>{
            term.write(data)
        })
        term.open(TerminalRef.current)
    },[])
  return (
    <div className='terminal' ref={TerminalRef}></div>
  )
}
