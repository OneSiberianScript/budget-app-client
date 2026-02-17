import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginImportX from 'eslint-plugin-import-x'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import globals from 'globals'

const FSD_LAYER_ORDER = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

export default [
    { ignores: ['dist', 'node_modules', 'public', '**/*.config.*', 'coverage', 'scripts'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        ...pluginImportX.flatConfigs.recommended,
        rules: {
            ...pluginImportX.flatConfigs.recommended.rules,
            'import-x/no-unresolved': 'off'
        }
    },
    {
        files: ['**/*.{js,ts,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser }
        }
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.vue']
            }
        },
        rules: {
            'vue/multi-word-component-names': ['error', { ignores: [] }],
            'vue/component-name-in-template-casing': [
                'error',
                'PascalCase',
                {
                    registeredComponentsOnly: false,
                    ignores: ['/^a-/', 'router-view', 'router-link', 'Form.Item', 'component']
                }
            ],
            'vue/attributes-order': [
                'error',
                {
                    order: [
                        'DEFINITION',
                        'LIST_RENDERING',
                        'CONDITIONALS',
                        'RENDER_MODIFIERS',
                        'GLOBAL',
                        'UNIQUE',
                        'TWO_WAY_BINDING',
                        'OTHER_DIRECTIVES',
                        'OTHER_ATTR',
                        'EVENTS',
                        'CONTENT'
                    ]
                }
            ],
            'vue/max-attributes-per-line': ['error', { singleline: { max: 3 }, multiline: { max: 1 } }]
        }
    },
    {
        files: ['**/*.{ts,vue}'],
        plugins: { 'import-x': pluginImportX },
        rules: {
            'import-x/order': [
                'error',
                {
                    pathGroups: [
                        ...FSD_LAYER_ORDER.map((layer) => ({
                            pattern: `@/${layer}/**`,
                            group: 'internal',
                            position: 'before'
                        }))
                    ],
                    pathGroupsExcludedImportTypes: ['builtin', 'external'],
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true }
                }
            ]
        }
    },
    eslintConfigPrettier
]
