// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'

// function App() {
//   const ipcHandle = () => window.electron.ipcRenderer.send('ping')

//   return (
//     <>
//       <img alt="logo" className="logo" src={electronLogo} />
//       <div className="creator">Powered by electron-vite</div>
//       <div className="text">
//         Build an Electron app with <span className="react">React</span>
//       </div>
//       <p className="tip">
//         Please try pressing <code>F12</code> to open the devTool
//       </p>
//       <div className="actions">
//         <div className="action">
//           <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
//             Documentation
//           </a>
//         </div>
//         <div className="action">
//           <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
//             Send IPC
//           </a>
//         </div>
//       </div>
//       <Versions></Versions>
//     </>
//   )
// }

// export default App

import { Box, Stack } from '@mui/material'
import React from 'react'
import NavBar from './components/NavBar.jsx'
import ChatBox from './components/ChatBox.jsx'
import RightBar from './components/RightBar.jsx'
import { ChatsProvider } from './components/contexts/ChatContext.jsx'

function App() {
  return (
    <>
      <ChatsProvider>
        <Box
          sx={{
            bgcolor: 'black',
            width: '100vw',
            height: '100vh'
          }}
        >
          <NavBar />
          {/* <span style={{ color: "white" }}>untitled chat</span> */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              height: '90%',
              marginTop: '5%'
            }}
          >
            <Stack
              direction="row"
              sx={{
                color: 'white',
                // border: "solid 1px white",
                width: '95%',
                height: '80%',
                gap: 15
              }}
            >
              <ChatBox />
              <RightBar />
            </Stack>
          </Box>
        </Box>
      </ChatsProvider>
    </>
  )
}

export default App
