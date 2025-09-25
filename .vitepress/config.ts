import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",
  
  title: "Vue Axios Manager",
  description: "Vue Axios Manager is a lightweight plugin that enables you to manage multiple Axios endpoints in any Vue application with ease and clarity",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/installation' }
    ],

    sidebar: [
      {
        text: 'Installation & Usage',
        items: [
          { text: 'Getting started', link: '/installation' },
          { text: 'Composables', link: '/composables' },
          { text: 'Contributing', link: '/contributing' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Zadigo/vue-axios-manager.git' }
    ]
  }
})
