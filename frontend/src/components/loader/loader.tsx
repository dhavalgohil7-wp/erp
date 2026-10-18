import React, { useState, useEffect } from 'react';
import './loader.css';

const DEFAULT_FONTS = [
    'Inter',
    'Font Awesome 6 Free',
];

/**
 * Format font family to valid font specifier for document.fonts.load / check
 */
function getFontSpec(font: string) {
    if (font.includes('px')) return font;
    if (font.includes('Font Awesome')) return `900 16px "${font}"`;
    return `16px "${font}"`;
}

/**
 * Waits for external Font stylesheet <link> tags in document <head> to finish loading.
 */
function waitForFontStylesheets(maxWaitMs = 2000): Promise<boolean> {
    return new Promise((resolve) => {
        const checkStylesheets = () => {
            const fontLinks = Array.from(
                document.querySelectorAll('link[rel="stylesheet"]')
            ) as HTMLLinkElement[];
            const filtered = fontLinks.filter((link) => {
                const href = link.href || '';
                return (
                    href.includes('fonts.googleapis.com') ||
                    href.includes('font-awesome') ||
                    href.includes('fontawesome')
                );
            });
            if (filtered.length === 0) return true;

            // When a stylesheet has loaded, link.sheet is populated
            return filtered.every((link) => {
                try {
                    return Boolean(link.sheet);
                } catch {
                    return true;
                }
            });
        };

        if (checkStylesheets()) {
            resolve(true);
            return;
        }

        const interval = setInterval(() => {
            if (checkStylesheets()) {
                clearInterval(interval);
                resolve(true);
            }
        }, 30);

        setTimeout(() => {
            clearInterval(interval);
            resolve(false);
        }, maxWaitMs);
    });
}

export interface FontLoaderProps {
    fonts?: string[];
    timeout?: number;
    loadingText?: string;
    children: React.ReactNode;
}

/**
 * FontLoader / Loader component
 * Holds a loader overlay until Google Fonts and Font Awesome are imported and ready.
 */
function FontLoader({
    fonts = DEFAULT_FONTS,
    timeout = 3500,
    loadingText = 'Loading application...',
    children,
}: FontLoaderProps) {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const targetFonts = fonts && fonts.length > 0 ? fonts : DEFAULT_FONTS;

        const checkAndLoadFonts = async () => {
            try {
                // 1. Wait for Google Font & Font Awesome stylesheet link elements to load
                await waitForFontStylesheets(1500);

                // 2. Trigger explicit font face loading if document.fonts is supported
                if (typeof document !== 'undefined' && 'fonts' in document) {
                    const loadPromises = targetFonts.map((font) => {
                        const fontSpec = getFontSpec(font);
                        return document.fonts.load(fontSpec).catch(() => []);
                    });

                    await Promise.allSettled(loadPromises);

                    // Wait for all active font loading tasks to complete
                    await document.fonts.ready;

                    // Verify key fonts with document.fonts.check up to a short ceiling
                    const startTime = Date.now();
                    while (Date.now() - startTime < 1000) {
                        const allReady = targetFonts.every((font) => {
                            const fontSpec = getFontSpec(font);
                            return document.fonts.check(fontSpec);
                        });
                        if (allReady) break;
                        await new Promise((r) => setTimeout(r, 50));
                    }
                }
            } catch (err) {
                console.warn('Font loading check encountered an issue:', err);
            } finally {
                if (isMounted) {
                    setIsFading(true);
                    setTimeout(() => {
                        if (isMounted) setFontLoaded(true);
                    }, 300);
                }
            }
        };

        checkAndLoadFonts();

        // Safety fallback timer so user is never blocked if network fails
        const timer = setTimeout(() => {
            if (isMounted) {
                setIsFading(true);
                setTimeout(() => {
                    if (isMounted) setFontLoaded(true);
                }, 300);
            }
        }, timeout);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [fonts, timeout]);

    return (
        <>
            {children}
            {!fontLoaded && (
                <div className={`font-loader-container ${isFading ? 'fade-out' : ''}`}>
                    <div className="font-loader-card">
                        <div className="font-loader-spinner"></div>
                        <p className="font-loader-text">{loadingText}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default FontLoader;
