export default interface PackageJSON {
    name: string,
    version: string,
    repository: string,
    homepage: string,
    dependencies: { [dependency: string]: string },
}
