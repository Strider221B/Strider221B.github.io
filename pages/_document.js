/**
 * @file pages/_document.js
 * @description Custom Document augmenting HTML tags, head metadata, Google Fonts,
 * and script injection for the Ubuntu portfolio application.
 */

// 1. React / Next.js core
import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document component to configure HTML shell, SEO meta tags, and web typography.
 *
 * @returns {JSX.Element} Document HTML shell
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Somesh Chatterjee's personal portfolio website simulating an Ubuntu 22.04 LTS desktop environment."
        />
        <meta
          name="keywords"
          content="Somesh Chatterjee, Portfolio, Ubuntu, Linux, Data Science, Machine Learning, Developer"
        />
        <meta name="author" content="Somesh Chatterjee" />
        <meta name="theme-color" content="#E95420" />

        {/* Favicon & Theme Icons */}
        <link rel="icon" href="/themes/Yaru/system/user-home.png" type="image/png" />

        {/* Google Fonts preconnect for Ubuntu typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="select-none bg-ub-grey text-ubt-grey antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
