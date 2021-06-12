import { encode as arrayBufferToBase64 } from 'base64-arraybuffer'

export const sandboxCode = ({ buffers, code, config }) => {
  const TSDeps = config.types
    ? {
        devDependencies: {
          '@types/react': '17.0.0',
          '@types/react-dom': '17.0.0',
          typescript: '4.1.3',
          'react-scripts': '4.0.3',
        },
      }
    : { devDependencies: { 'react-scripts': '4.0.3' } }
  return {
    files: {
      'public/index.html': {
        content: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <!--
              manifest.json provides metadata used when your web app is added to the
              homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
            -->
          <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
          <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">

          <title>React App</title>
        </head>
        
        <body>
          <noscript>
            You need to enable JavaScript to run this app.
          </noscript>
          <div id="root"></div>
        </body>
        </html>`,
      },
      [`src/index.${config.types ? 'tsx' : 'js'}`]: {
        content: `
import React from 'react'
import ReactDOM from "react-dom"
import './style.css'
import App from "./App"

ReactDOM.render(<App />, document.getElementById("root"))`,
      },
      [`src/App.${config.types ? 'tsx' : 'js'}`]: {
        content: `
import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import Model from './Model'

export default function Viewer() {
  const ref = useRef()
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <Stage controls={ref} preset="${config.preset}" intensity={${config.intensity}} ${
          !config.contactShadow ? ' contactShadow={false}' : ''
        }${!config.shadows ? ' shadows={false}' : ''} environment="${config.environment}">
          <Model />
        </Stage>
      </Suspense>
      <OrbitControls ref={ref}${config.autoRotate ? ' autoRotate' : ''} />
    </Canvas>
  )
}`,
      },
      'src/style.css': {
        content: `
html,
body,
#root {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}
        `,
      },

      ...Object.fromEntries(
        Array.from(buffers.entries()).map(([path, buffer]) => [
          `public/${path}`,
          { content: arrayBufferToBase64(buffer) },
        ])
      ),

      [`src/Model.${config.types ? 'tsx' : 'js'}`]: { content: code },
      '.gitignore': {
        content: `
node_modules
build
      `,
      },
      'package.json': {
        content: {
          dependencies: {
            '@react-three/drei': '^4.1.8',
            '@react-three/fiber': '^6.0.13',
            '@types/three': '0.127.0',
            react: '^17.0.2',
            'react-dom': '^17.0.2',
            three: '0.127.0',
          },
          ...TSDeps,
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build',
            test: 'react-scripts test --env=jsdom',
            eject: 'react-scripts eject',
          },
          browserslist: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all'],
        },
      },
    },
  }
}
