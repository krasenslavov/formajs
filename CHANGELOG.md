# Changelog

All notable changes to FormaJS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.6] - 2025-11-25

### Security

#### Critical Vulnerabilities Fixed (4)
- **CVE-2022-37601** - Fixed loader-utils vulnerability by upgrading to ^3.3.1
- **CVE-2021-44906** - Fixed minimist vulnerability via dependency updates to ^1.2.6
- **GHSA-vjh7-7g9h-fjfh** - Fixed elliptic cryptographic vulnerability by upgrading to ^6.6.0
- **CVE-2025-6547, CVE-2025-6545** - Fixed cipher-base vulnerabilities by upgrading to ^1.0.6

#### High Severity Vulnerabilities Fixed (11)
- **CVE-2022-25858** - Fixed terser DoS vulnerability by upgrading to ^5.36.0
- **CVE-2022-3517** - Fixed minimatch ReDoS vulnerability by upgrading to ^9.0.5
- **CVE-2022-37599, CVE-2022-37603** - Fixed additional loader-utils vulnerabilities
- **CVE-2022-38900** - Fixed decode-uri-component vulnerability by upgrading to ^0.4.1
- **CVE-2022-46175** - Fixed json5 prototype pollution by upgrading to ^2.2.3
- **CVE-2022-25883** - Fixed semver ReDoS vulnerability by upgrading to ^7.6.3
- **CVE-2023-46234** - Fixed browserify-sign signature forgery by upgrading to ^4.2.3
- **CVE-2024-4068** - Fixed braces resource consumption vulnerability by upgrading to ^3.0.3

#### Moderate Severity Vulnerabilities Fixed (2)
- **CVE-2020-11022** - Fixed jQuery XSS vulnerability by upgrading from 3.4.1 to 3.7.1
- **CVE-2024-4067** - Fixed micromatch ReDoS vulnerability by upgrading to ^4.0.8

#### Low Severity Vulnerabilities Fixed (5)
- **CVE-2024-42459, CVE-2024-42461, CVE-2024-42460, CVE-2024-48949** - Fixed multiple elliptic curve cryptography issues

### Changed

#### Dependencies
- Updated `sass` from ^1.16.0 to ^1.80.0
- Updated `sass-loader` from ^7.1.0 to ^16.0.0
- Added comprehensive dependency overrides to enforce secure versions of transitive dependencies

#### Frontend Libraries
- Upgraded jQuery from 3.4.1 to 3.7.1 in all documentation pages (30 files updated)
- Removed vulnerable `jquery-3.4.1.min.js` file
- Added secure `jquery-3.7.1.min.js` file

#### Version Updates
- Updated version strings across all source files:
  - `src/js/forma.js` - Updated header from v0.0.4 to v0.0.6
  - `dist/js/forma.min.js` - Updated header from v0.0.4 to v0.0.6
  - `docs/resources/lib/forma/js/forma.js` - Updated header from v0.0.4 to v0.0.6
  - `docs/resources/lib/forma/js/forma.min.js` - Updated header from v0.0.4 to v0.0.6
- Updated all version references in HTML documentation files

#### Documentation
- Updated all download links from v0.0.4-alpha to v0.0.6-alpha
- Updated version references across 30+ HTML documentation files

### Added
- `SECURITY-FIXES.md` - Comprehensive security vulnerability fix documentation
- `CHANGELOG.md` - This changelog file
- `package.json` now includes `overrides` section to enforce secure dependency versions

### Fixed
- Resolved all npm audit vulnerabilities (0 vulnerabilities remaining)
- Package dependency tree reduced from thousands of packages to 20 packages
- Eliminated all known security issues in the project

### Technical Details

#### Before Security Fixes
- Total Vulnerabilities: 22
- npm packages: Thousands (bloated dependency tree)
- jQuery Version: 3.4.1 (vulnerable to XSS)
- Outdated build tools with multiple critical CVEs

#### After Security Fixes
- Total Vulnerabilities: 0
- npm packages: 20 (lean dependency tree)
- jQuery Version: 3.7.1 (secure)
- All build tools updated to latest secure versions

#### Verification
```bash
npm audit
# Result: found 0 vulnerabilities ✅
```

### Developer Notes
- No breaking changes to the FormaJS API
- All source code functionality remains identical
- Documentation site updated with secure dependencies
- Build process remains unchanged
- No impact on end users of the library

### Migration Guide
If you're upgrading from v0.0.5 or earlier:

1. **For Library Users (CDN/Download)**
   - No changes required - API remains identical
   - Optionally update to latest dist files for consistency

2. **For Contributors/Developers**
   - Delete `node_modules/` and `package-lock.json`
   - Run `npm install` to get updated dependencies
   - All existing build scripts work without modification

3. **For Documentation Site Users**
   - jQuery automatically updated to 3.7.1
   - All examples work without modification

### Recommendations
- Run `npm audit` regularly to catch new vulnerabilities
- Consider integrating GitHub Dependabot for automated security alerts
- Update dependencies quarterly to maintain security posture
- Monitor CVE databases for FormaJS dependencies

## [0.0.5] - 2020-XX-XX

### Changed
- Updated URLs in documentation
- Repository maintenance updates

## [0.0.4] - 2020-XX-XX

### Initial Alpha Release
- Core FormaJS functionality
- Dynamic form generation
- Progressive disclosure modes (tab, manual, show)
- Built-in HTML5 validation support
- Bootstrap 4 integration
- Multiple CSS themes (barebone, base, boilerplate, complete)
- SCSS/SASS support
- Comprehensive documentation site
- 20+ example implementations

---

## Legend

- **Security**: Security vulnerability fixes
- **Added**: New features or files
- **Changed**: Changes to existing functionality
- **Deprecated**: Features that will be removed in future versions
- **Removed**: Features that have been removed
- **Fixed**: Bug fixes
- **Performance**: Performance improvements

---

*For detailed security information, see [SECURITY-FIXES.md](SECURITY-FIXES.md)*
