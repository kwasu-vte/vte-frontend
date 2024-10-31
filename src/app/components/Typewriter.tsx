// // // components/Typewriter.js
// // "use client"; // Necessary for use in Next.js
// // import { useEffect, useState } from "react";

// // const Typewriter = ({ text, speed = 100, delay = 2000 }) => {
// //   const [displayedText, setDisplayedText] = useState("");
// //   const [index, setIndex] = useState(0);

// //   useEffect(() => {
// //     // Start typing out the text
// //     const typeInterval = setInterval(() => {
// //       if (index < text.length) {
// //         setDisplayedText((prev) => prev + text[index]);
// //         setIndex((prev) => prev + 1);
// //       } else {
// //         // Wait, then reset the text to create a repeating effect
// //         setTimeout(() => {
// //           setDisplayedText("");
// //           setIndex(0);
// //         }, delay);
// //       }
// //     }, speed);

// //     return () => clearInterval(typeInterval);
// //   }, [index, text, speed, delay]);

// //   return <span>{displayedText}</span>;
// // };

// // export default Typewriter;


// // components/Typewriter.js
// // "use client"; // For client-side functionality in Next.js
// // import { useEffect, useState, useCallback } from "react";

// // const Typewriter = ({ text, speed = 100, delay = 2000 }) => {
// //   const [displayedText, setDisplayedText] = useState("");
// //   const [index, setIndex] = useState(0);

// //   // Memoize the typing effect
// //   const typeText = useCallback(() => {
// //     if (index < text.length) {
// //       setDisplayedText((prev) => prev + text[index]);
// //       setIndex((prev) => prev + 1);
// //     } else {
// //     //   // Reset after delay
// //     //   setTimeout(() => {
// //     //     setDisplayedText("");
// //     //     setIndex(0);
// //     //   }, delay);
// //     }
// //   }, [index, text, delay]);

// //   useEffect(() => {
// //     // Interval for typing effect
// //     const typeInterval = setInterval(typeText, speed);

// //     // Cleanup interval to prevent multiple instances
// //     return () => clearInterval(typeInterval);
// //   }, [typeText, speed]);

// //   return <span>{displayedText}</span>;
// // };

// // export default Typewriter;



// import React, { useEffect, useState } from 'react';

// const Typewriter = ({ text, speed = 100 }) => {
//     const [displayedText, setDisplayedText] = useState('');
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [textIndex, setTextIndex] = useState(0);

//     useEffect(() => {
//         const type = () => {
//             const fullText = text;
//             const currentLength = displayedText.length;

//             if (isDeleting) {
//                 setDisplayedText(fullText.substring(0, currentLength - 1));
//                 if (currentLength === 0) {
//                     setIsDeleting(false);
//                     setTextIndex((prevIndex) => (prevIndex + 1) % text.length);
//                 }
//             } else {
//                 setDisplayedText(fullText.substring(0, currentLength + 1));
//                 if (currentLength === fullText.length) {
//                     setIsDeleting(true);
//                 }
//             }
//         };

//         const timer = setTimeout(() => {
//             type();
//         }, speed);

//         return () => clearTimeout(timer);
//     }, [displayedText, isDeleting, text, speed]);

//     return <div>{displayedText}</div>;
// };

// export default Typewriter;

// import React, { useEffect, useState } from 'react';
// import GraphemeSplitter from 'grapheme-splitter';

// const Typewriter = ({ text, speed = 100 }) => {
//     const [displayedText, setDisplayedText] = useState('');
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [textIndex, setTextIndex] = useState(0);
//     const splitter = new GraphemeSplitter();

//     useEffect(() => {
//         const fullText = text;
//         const graphemes = splitter.splitGraphemes(fullText);
//         const type = () => {
//             const currentLength = displayedText.length;

//             if (isDeleting) {
//                 setDisplayedText(graphemes.slice(0, currentLength - 1).join(''));
//                 if (currentLength === 0) {
//                     setIsDeleting(false);
//                     setTextIndex((prevIndex) => (prevIndex + 1) % graphemes.length);
//                 }
//             } else {
//                 setDisplayedText(graphemes.slice(0, currentLength + 1).join(''));
//                 if (currentLength === graphemes.length) {
//                     setIsDeleting(true);
//                 }
//             }
//         };

//         const timer = setTimeout(() => {
//             type();
//         }, speed);

//         return () => clearTimeout(timer);
//     }, [displayedText, isDeleting, text, speed]);

//     return <div>{displayedText}</div>;
// };

// export default Typewriter;

// import React, { useEffect, useState } from 'react';
// import GraphemeSplitter from 'grapheme-splitter';

// const Typewriter = ({ text, speed = 100 }) => {
//     const [displayedText, setDisplayedText] = useState('');
//     const [isDeleting, setIsDeleting] = useState(false);
//     const splitter = new GraphemeSplitter();
//     const graphemes = splitter.splitGraphemes(text);

//     useEffect(() => {
//         const type = () => {
//             const currentLength = displayedText.length;

//             if (isDeleting) {
//                 setDisplayedText(graphemes.slice(0, currentLength - 1).join(''));
//                 if (currentLength === 0) {
//                     setIsDeleting(false);
//                 }
//             } else {
//                 setDisplayedText(graphemes.slice(0, currentLength + 1).join(''));
//                 if (currentLength === graphemes.length) {
//                     setIsDeleting(true);
//                 }
//             }
//         };

//         const timer = setTimeout(() => {
//             type();
//         }, speed);

//         return () => clearTimeout(timer);
//     }, [displayedText, isDeleting, graphemes, speed]);

//     return <div>{displayedText}</div>;
// };

// export default Typewriter;


import React, { useEffect, useState } from 'react';
import GraphemeSplitter from 'grapheme-splitter';

const Typewriter = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const splitter = new GraphemeSplitter();
    const graphemes = splitter.splitGraphemes(text);

    useEffect(() => {
        const type = () => {
            const currentLength = displayedText.length;

            if (isDeleting) {
                // Remove one grapheme
                setDisplayedText(graphemes.slice(0, currentLength - 1).join(''));
                // If fully deleted, switch to typing
                if (currentLength === 1) {
                    setIsDeleting(false);
                }
            } else {
                // Add one grapheme
                setDisplayedText(graphemes.slice(0, currentLength + 1).join(''));
                // If fully typed, switch to deleting
                if (currentLength === graphemes.length) {
                    setIsDeleting(true);
                }
            }
        };

        const timer = setTimeout(() => {
            type();
        }, speed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, graphemes, speed]);

    return <div>{displayedText}</div>;
};

export default Typewriter;