import { warn } from '@vue/runtime-dom';
export * from '@vue/runtime-dom';

if ( (process.env.NODE_ENV !== 'production')) {
    console[console.info ? 'info' : 'log'](`You are running a development build of Vue.\n` +
        `Make sure to use the production build (*.prod.js) when deploying for production.`);
}

// This entry exports the runtime only, and is built as
const compile = () => {
    if ((process.env.NODE_ENV !== 'production')) {
        warn(`Runtime compilation is not supported in this build of Vue.` +
            ( ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
                ) /* should not happen */);
    }
};

export { compile };
