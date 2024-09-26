import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import perfectionist from 'eslint-plugin-perfectionist'
import react from 'eslint-plugin-react';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            perfectionist,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            // yoda style
            'yoda': [
                'error',
                'always',
            ],
            // blank line at the end of the file
            'eol-last': [
                'error',
                'always',
            ],
            // 4 spaces identation
            'indent': [
                'error',
                4,
                { SwitchCase: 1 },
            ],
            // \n eol
            'linebreak-style': [
                'error',
                'unix',
            ],
            // single quotes
            'quotes': [
                'error',
                'single',
            ],
            // semicolons at the end of every statement
            'semi': [
                'error',
                'always',
            ],
            // always add parenthesis in arrow functions
            'arrow-parens': [
                'error',
                'always',
            ],
            // add spaces inside braces
            'object-curly-spacing': [
                'error',
                'always',
            ],

            'arrow-spacing': 'warn',
            'block-spacing': 'warn',
            'function-call-argument-newline': ['warn', 'consistent'],
            'func-call-spacing': 'warn',
            'max-statements-per-line': 'warn',
            'newline-per-chained-call': 'warn',
            'no-multi-spaces': 'warn',
            'template-curly-spacing': ['warn', 'never'],
            'no-whitespace-before-property': 'warn',
            'no-trailing-spaces': 'warn',
            'no-multiple-empty-lines': [
                'warn',
                { max: 1, maxBOF: 0 },
            ],

            'template-tag-spacing': 'warn',

            'prefer-arrow-callback': [
                'warn',
                { allowNamedFunctions: true },
            ],
            'prefer-exponentiation-operator': 'warn',
            'prefer-promise-reject-errors': [
                'warn',
                { allowEmptyReject: true },
            ],
            'prefer-rest-params': 'warn',
            'prefer-spread': 'warn',
            'quote-props': [
                'warn',
                'consistent-as-needed',
            ],
            'require-await': 'warn',
            'require-yield': 'warn',
            'comma-spacing': 'warn',
            'computed-property-spacing': 'warn',
            'dot-location': [
                'warn',
                'property',
            ],
            'function-paren-newline': [
                'warn',
                'multiline-arguments',
            ],
            'generator-star-spacing': [
                'warn',
                { before: false, after: true },
            ],
            'implicit-arrow-linebreak': 'warn',
            'key-spacing': 'warn',
            'keyword-spacing': 'warn',
            'lines-between-class-members': [
                'warn',
                'always',
                { exceptAfterSingleLine: true },
            ],
            'padded-blocks': [
                'warn',
                'never',
            ],
            'rest-spread-spacing': 'warn',
            'space-before-blocks': 'warn',
            'space-in-parens': 'warn',
            'space-unary-ops': 'warn',
            'switch-colon-spacing': 'warn',
            'wrap-iife': [
                'warn',
                'any',
            ],
            'yield-star-spacing': [
                'warn',
                'after',
            ],

            'array-bracket-newline': ['warn', { multiline: true }],
            'array-element-newline': ['warn', 'consistent'],
            'comma-dangle': ['warn', 'always-multiline'],
            'prefer-const': 'warn',
            'no-self-compare': 'error',
            'no-duplicate-imports': 'warn',
            'no-constant-binary-expression': 'error',
            'no-unreachable-loop': 'error',
            'no-template-curly-in-string': 'warn',
            'default-param-last': 'warn',
            'dot-notation': 'warn',
            'curly': ['warn', 'all'],
            'brace-style': 'warn',
            'eqeqeq': ['error', 'smart'],
            'no-nested-ternary': 'warn',
            'no-unneeded-ternary': 'warn',
            'new-cap': 'warn',
            'multiline-ternary': ['warn', 'always-multiline'],
            'operator-linebreak': [
                'warn',
                'after',
                {
                    overrides: {
                        '?': 'before',
                        ':': 'before',
                    },
                },
            ],
            'no-empty': 'warn',
            'no-extra-semi': 'warn',
            'no-extra-parens': [
                'warn',
                'functions',
            ],
            'no-lonely-if': 'warn',
            'no-lone-blocks': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-unused-expressions': [
                'warn',
                {
                    allowShortCircuit: true,
                },
            ],
            'no-useless-rename': 'warn',
            'no-var': 'error',
            'no-mixed-operators': 'warn',
            'prefer-template': 'warn',
            'object-curly-newline': ['warn'],
            'object-property-newline': [
                'warn',
                {
                    allowAllPropertiesOnSameLine: true,
                },
            ],

            'react/destructuring-assignment': [
                1,
                'always',
            ],
            'react/jsx-boolean-value': [
                1,
                'never',
            ],
            'react/no-unknown-property': 'warn',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-closing-bracket-location': [1, 'line-aligned'],
            'react/jsx-closing-tag-location': 1,
            'react/jsx-curly-brace-presence': [
                1,
                'always',
            ],
            'react/jsx-curly-spacing': [
                1,
                { when: 'never', children: true },
            ],
            'react/jsx-equals-spacing': [
                1,
                'never',
            ],
            'react/jsx-max-props-per-line': [
                1,
                { maximum: 1, when: 'multiline' },
            ],
            'react/jsx-no-useless-fragment': [
                1,
                { allowExpressions: true },
            ],
            'react/jsx-props-no-multi-spaces': 1,
            'react/jsx-wrap-multilines': [
                1,
                {
                    declaration: 'parens-new-line',
                    assignment: 'parens-new-line',
                    return: 'parens-new-line',
                    arrow: 'parens-new-line',
                    condition: 'parens-new-line',
                    logical: 'ignore',
                    prop: 'ignore',
                },
            ],
            'react/jsx-first-prop-new-line': [
                1,
                'multiline',
            ],
            'react/function-component-definition': [
                1,
                {
                    namedComponents: 'arrow-function',
                    unnamedComponents: 'arrow-function',
                },
            ],
            'react/prop-types': 0,
            'react/jsx-one-expression-per-line': [
                1,
                { allow: 'single-child' },
            ],

            'perfectionist/sort-imports': [
                'warn',
                {
                    'groups': [
                        'type',
                        ['builtin', 'external'],
                        'internal-type',
                        'internal',
                        ['parent-type', 'sibling-type', 'index-type'],
                        ['parent', 'sibling', 'index'],
                        'object',
                        'unknown',
                    ],
                },
            ],

            ...reactHooks.configs.recommended.rules,
        },
    },
)
