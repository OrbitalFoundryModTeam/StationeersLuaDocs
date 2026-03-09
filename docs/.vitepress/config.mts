import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'StationeersLua',
  description: 'Lua scripting for Stationeers programmable chips',
  base: '/StationeersLuaDocs/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/StationeersLuaDocs/favicon.png' }],
  ],

  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/device-io' },
      { text: 'Examples', link: '/examples/patterns' },
      {
        text: 'Links',
        items: [
          { text: 'ScriptedScreens Docs', link: 'https://orbitalfoundrymodteam.github.io/ScriptedScreensDocs/' },
          { text: 'Discord', link: 'https://discord.gg/HxvySSu5G3' },
          { text: 'Ko-fi', link: 'https://ko-fi.com/G2G61S5ZB5' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is StationeersLua?', link: '/guide/what-is-stationeers-lua' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ]
        },
        {
          text: 'Fundamentals',
          items: [
            { text: 'How Lua Chips Work', link: '/guide/how-it-works' },
            { text: 'Script Structure', link: '/guide/script-structure' },
            { text: 'Enums & Constants', link: '/guide/enums-constants' },
            { text: 'Sandbox & Limits', link: '/guide/sandbox' },
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Control Flow', link: '/guide/control-flow' },
            { text: 'Save/Load Persistence', link: '/guide/persistence' },
            { text: 'Library Chips (require)', link: '/guide/library-chips' },
            { text: 'Debugging', link: '/guide/debugging' },
            { text: 'Error Handling', link: '/guide/error-handling' },
            { text: 'Migrating from IC10', link: '/guide/migrating-from-ic10' },
          ]
        },
      ],
      '/api/': [
        {
          text: 'Core API',
          items: [
            { text: 'Device I/O', link: '/api/device-io' },
            { text: 'Batch Operations', link: '/api/batch' },
            { text: 'Slots & Reagents', link: '/api/slots-reagents' },
            { text: 'Memory & Stack', link: '/api/memory-stack' },
            { text: 'Bitwise Operations', link: '/api/bitwise' },
            { text: 'String & Hash', link: '/api/string-hash' },
          ]
        },
        {
          text: 'Networking',
          items: [
            { text: 'Direct Messaging', link: '/api/net-messaging' },
            { text: 'Pub/Sub', link: '/api/net-pubsub' },
            { text: 'RPC', link: '/api/net-rpc' },
            { text: 'Pack/Unpack', link: '/api/net-pack' },
          ]
        },
        {
          text: 'Utilities',
          items: [
            { text: 'Temperature', link: '/api/temperature' },
            { text: 'Time', link: '/api/time' },
            { text: 'JSON', link: '/api/json' },
            { text: 'Events', link: '/api/events' },
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Quick Reference Card', link: '/api/quick-reference' },
          ]
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Common Patterns', link: '/examples/patterns' },
            { text: 'Thermostat', link: '/examples/thermostat' },
            { text: 'Solar Tracker', link: '/examples/solar-tracker' },
            { text: 'Airlock Controller', link: '/examples/airlock' },
            { text: 'Sensor Network', link: '/examples/sensor-network' },
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/HxvySSu5G3' },
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/orbitalfoundrymodteam/StationeersLuaDocs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: '⚠️ This documentation was AI-generated and may contain inaccuracies. Please submit pull requests with corrections as needed.',
      copyright: 'Stationeers is developed by Rocketwerkz'
    },

    outline: {
      level: [2, 3]
    },
  },

  markdown: {
    lineNumbers: true
  }
})
