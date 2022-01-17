module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/recommended'
	],
	globals: {
		fetch: true,
		window: true,
		ymaps: true
	},
	overrides: [
		{
			files: ['*.vue'],
			rules: {
				indent: 'off',
				'no-tabs': 0
			}
		}
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	rules: {
		'comma-dangle': ['error', 'never'],
		'eol-last': ['error', 'always'],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'quotes': ['error', 'single'],
		'quote-props': 'off',
		'semi': ['error', 'always'],
		'space-before-function-paren': ['error', 'never'],
		'vue/no-v-html': 'off',
		'vue/no-mutating-props': 'off',

		'vue/arrow-spacing': 'error',
		'vue/component-name-in-template-casing': ['error', 'kebab-case', {
			registeredComponentsOnly: false
		}],
		'vue/eqeqeq': 'error',
		'vue/html-closing-bracket-newline': ['error', {
			multiline: 'never',
			singleline: 'never'
		}],
		'vue/max-attributes-per-line': ['error', {
			multiline: {
				allowFirstLine: false,
				max: 1
			},
			singleline: 8
		}],
		'vue/match-component-file-name': 'error',
		'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'vue/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'vue/script-indent': ['error', 2, {
			baseIndent: 1,
			switchCase: 1
		}],
		'vue/singleline-html-element-content-newline': 'off',
		'vue/v-bind-style': ['error', 'longform'],
		'vue/v-on-style': ['error', 'longform'],
		'vue/valid-v-slot': ['error', {
			allowModifiers: true
		}],
		'vue/v-slot-style': ['error', 'longform']
	}
};
