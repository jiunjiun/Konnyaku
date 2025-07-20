import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  permissions: ['activeTab', 'storage', 'contextMenus'],
  host_permissions: ['https://generativelanguage.googleapis.com/*'],
  icons: {
    48: 'src/assets/images/logo.png',
    128: 'src/assets/images/logo.png'
  },
  background: {
    service_worker: 'src/background.js',
    type: 'module'
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'src/assets/images/logo.png',
    default_title: 'Konnyaku'
  },
  options_page: 'options.html',
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content.js'],
      css: ['src/content.css']
    }
  ],
  web_accessible_resources: [
    {
      resources: ['src/content.css', 'src/assets/images/logo.png'],
      matches: ['<all_urls>']
    }
  ]
})
