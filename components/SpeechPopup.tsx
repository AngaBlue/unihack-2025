'use client'
import {useState} from 'react';
import Image from 'next/image';

export default function SpeechPopup() {

  const [modal, setModal] = useState(false);

  return (
    <div style={{position: 'absolute', top:50, bottom: 50, left: 50, right: 50, backgroundColor: 'white', padding: 20}}>
      <button onClick={() => setModal(!modal)}>Click Me</button>
      {modal && (
        <div>
          <h1>Modal</h1>
          <p>Modal Content</p>
          <Image src="/mascot.png" alt="placeholder" width={50} height={50}/>
        </div>
      )}
    </div>
  );
}
