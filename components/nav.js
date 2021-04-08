import { useState } from 'react'
import Tippy from '@tippyjs/react'
import copy from 'clipboard-copy'
import 'tippy.js/dist/tippy.css'
import useSandbox from '../lib/utils/useSandbox'
import { CodesandboxIcon, CopyIcon, TSIcon } from './icons'
import Toggle from './toggle'

const Nav = ({ code, config, setConfig, fileName, textOriginalFile }) => {
  const [copied, setCopied] = useState(false)
  const [sandboxId, error] = useSandbox({ fileName, textOriginalFile, code })

  const copyToClipboard = async () => {
    try {
      await copy(code)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 200)
      // eslint-disable-next-line no-empty
    } catch {}
  }

  return (
    <nav className="p-10 flex justify-end align-center">
      <ul className="flex justify-end align-center">
        <li className={`"hover:text-green-600 pr-5`}>
          <Toggle onToggle={(shadows) => setConfig({ ...config, shadows })} active={config.shadows}>
            Shadows
          </Toggle>
        </li>
        <li className={`${config.types ? 'text-blue-600' : ''} hover:text-blue-600 pr-5`}>
          <Tippy content={config.types ? 'Hide Typescript types' : 'Show Typescript types'}>
            <button className="cursor-pointer" onClick={() => setConfig({ ...config, types: !config.types })}>
              <TSIcon />
            </button>
          </Tippy>
        </li>
        <li className={`${!copied ? 'text-gray-900' : 'text-green-600'} hover:text-green-600 pr-5`}>
          <Tippy content={copied ? 'Copied' : 'Copy to Clipboard'}>
            <button className="cursor-pointer" onClick={copyToClipboard}>
              <CopyIcon />
            </button>
          </Tippy>
        </li>

        {!error ? (
          <li className={`${sandboxId ? 'text-gray-900 hover:text-green-600' : 'text-gray-200'} `}>
            <Tippy content={sandboxId ? 'Open in Codesandbox' : 'Creating a sandbox...'}>
              {sandboxId ? (
                <a
                  className="cursor-pointer"
                  rel="noreferrer"
                  href={`https://codesandbox.io/s/${sandboxId}`}
                  target="_blank">
                  <CodesandboxIcon />
                </a>
              ) : (
                <button>
                  <CodesandboxIcon />
                </button>
              )}
            </Tippy>
          </li>
        ) : (
          <li className="text-red-600">
            <Tippy content={'There was a problem creating your sandbox'}>
              <button>
                <CodesandboxIcon />
              </button>
            </Tippy>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Nav
