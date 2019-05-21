export abstract class DbDefaultsBase
{
    protected abstract async init();
    protected abstract async run();
    protected abstract async end();
}