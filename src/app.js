/*eslint-env node*/

import 'bootstrap-loader'
import React from 'react'
import { render } from 'react-dom'
import Root from 'Root'
import configureStore from 'configureStore'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

// Set favicon
let faviconPath = require('!!file?name=favicon.ico!../static/images/favicon.png')
let favicon = document.createElement('link')
favicon.type = 'image/png'
favicon.rel = 'shortcut icon'
favicon.href = faviconPath
document.getElementsByTagName('head')[0].appendChild(favicon)

// Start app
export const store = configureStore()
render(
	<I18nextProvider i18n={i18n}>
		<Root store={store}/>
    </I18nextProvider>,
	document.getElementById('root')
)
