import webpack from 'webpack';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { buildDevServer } from './buildDevServer';
import { buildLoaders } from './buildLoaders';
import { buildPlugins } from './buildPlugins';
import { buildResolvers } from './buildResolvers';
import { BuildOptions } from './types/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function buildWebpack(options: BuildOptions) : webpack.Configuration
{
    const {mode, paths, port} = options;
    const isProd = options.mode === 'production';
    const isDev = options.mode ==='development';

    return {
        mode: mode ?? 'development',
        entry: paths.entry,
        output:
        {
            path: paths.output,
            filename: '[name].[contenthash].js',
            clean: true
        },
        plugins: buildPlugins(options),
        module:
        {
            rules: buildLoaders(options),
        },
        resolve: buildResolvers(options),
        devtool: isDev && 'inline-source-map',
        devServer: isDev ? buildDevServer(options) : undefined,
    }
}