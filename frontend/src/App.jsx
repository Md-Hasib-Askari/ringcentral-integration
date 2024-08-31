import { useEffect, useState } from 'react'
import WebPhone from 'ringcentral-web-phone'
import './App.css'

function App() {
  const [sipInfo, setSipInfo] = useState({
    transport: 'WSS',
    username: '13128589958*101',
    password: 'yOzOtrS47X',
    authorizationTypes: [ 'SipDigest' ],
    authorizationId: '801599041004',
    domain: 'sip.devtest.ringcentral.com',
    outboundProxy: 'sip112-101.devtest.ringcentral.com:8083',
    stunServers: [ 'stun1.ringcentral.com:19302', 'stun2.ringcentral.com:19302' ]
  })
  const [webPhone, setWebPhone] = useState(null)
  const [callSession, setCallSession] = useState(null)
  const [inboundSession, setInboundSession] = useState(null)
  const [outboundSession, setOutboundSession] = useState(null)

  const handleConnect = () => {
    if (sipInfo === null) return;
    const webPhone = new WebPhone({sipInfo}, {
      appKey: '1234567890',
      appName: 'WebPhone',
      appVersion: '1.0.0',
      logLevel: 0,
      audioHelper: {
        enabled: true,
        incoming: './audio/incoming.ogg',
        outgoing: './audio/outgoing.ogg'
      },
      media: {
        constraints: {
          audio: true,
          video: false
        },
        remote: {
          audio: document.getElementById('remoteAudio')
        }
      }
    });
    setWebPhone(webPhone);
    console.log('WebPhone connected');
    
    // Webphone Event Listeners
    webPhone.on('registered', () => {
      console.log('WebPhone registered');
    });
    webPhone.on('inboundCall', (inboundSession) => {
      console.log('Inbound call session', inboundSession);
      setInboundSession(inboundSession);
    });
    webPhone.on('outboundCall', (outboundCallSession) => {
      console.log('Outbound call session', outboundCallSession);
      setOutboundSession(outboundCallSession);
    });
  }

  const answerCall = async () => {
    if (inboundSession === null) {
      console.error('Call session is not available');
      return;
    }
    await inboundSession.answer().then(() => {
      console.log('Call answered');
      setCallSession(inboundSession);
    }).catch((error) => {
      console.error('Failed to answer', error);
    });
  }
  const rejectCall = async () => {
    if (inboundSession === null) {
      console.error('Call session is not available');
      return;
    }
    await inboundSession.reject().then(() => {
      console.log('Call rejected');
    }).catch((error) => {
      console.error('Failed to reject', error);
    });
  }

  const handleRegister = () => {
    webPhone.register().then(() => {
      console.log('Registered');
    }).catch((error) => {
      console.error('Failed to register', error);
    });
  }
  const handlePlaceCall = async () => {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const newCallSession = await webPhone.call(phoneNumber);
    console.log('Call session', newCallSession.state);
    setCallSession(newCallSession);
    
  }

  useEffect(() => {
    console.log('WebPhone', webPhone);
    console.log('CallSession', callSession);
  }, [webPhone, callSession]);

  const handleHangup = async () => {
    if (callSession === null) {
      console.error('Call session is not available');
      return;
    }
    callSession.hangup().then(() => {
      console.log('Call disconnected');
      setCallSession(null);
    }).catch((error) => {
      console.error('Failed to hangup', error);
    });
  }

  const handleMute = async () => {
    if (callSession === null) {
      console.error('Call session is not available');
      return;
    }
    await callSession.mute().then(() => {
      console.log('Call muted');
    }).catch((error) => {
      console.error('Failed to mute', error);
    });
  }
  const handleUnmute = async () => {
    if (callSession === null) {
      console.error('Call session is not available');
      return;
    }
    await callSession.unmute().then(() => {
      console.log('Call unmuted');
    }).catch((error) => {
      console.error('Failed to unmute', error);
    });
  }
  const handleHold = async () => {
    if (callSession === null) {
      console.error('Call session is not available');
      return;
    }
    await callSession.hold().then(() => {
      console.log('Call held');
    }).catch((error) => {
      console.error('Failed to hold', error);
    });
  }
  const handleUnhold = async () => {
    if (callSession === null) {
      console.error('Call session is not available');
      return;
    }
    await callSession.unhold().then(() => {
      console.log('Call unheld');
    }).catch((error) => {
      console.error('Failed to unhold', error);
    });
  }

    return (
    <>
      <div>Web Phone Testing</div>
      <audio id="remoteAudio" autoPlay={true} />
      <hr />
      <div>
        <button onClick={handleConnect}>Connect</button>
        <button onClick={handleRegister}>Register</button>
        <button onClick={answerCall}>Answer Call</button>
        <button onClick={rejectCall}>Reject Call</button>
      </div>
      <div>
        <input type="tel" name="" id="phoneNumber" />
        <button onClick={handlePlaceCall}>Place Call</button>
        <button onClick={handleHangup}>Hang Up</button>
        <button onClick={handleMute}>Mute</button>
        <button onClick={handleUnmute}>Unmute</button>
        <button onClick={handleHold}>Hold</button>
        <button onClick={handleUnhold}>Unhold</button>
      </div>
    </>
  )
}

export default App
