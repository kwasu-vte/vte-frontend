import React, { useEffect, useState } from 'react';
import GraphemeSplitter from 'grapheme-splitter';

// Step 1: Define the Props interface
interface TypewriterProps {
    text: string; // Define the type for 'text'
    speed?: number; // Define the type for 'speed', making it optional
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 100 }) => {
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