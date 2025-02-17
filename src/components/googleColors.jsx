import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";

// Google Calendar color options with their respective colorIds
const googleColors = [
  { id: '11', hex: '#EA4335', row: 1, col: 1 }, // Red
  { id: '4', hex: '#E67C73', row: 1, col: 2 }, // Salmon
  { id: '6', hex: '#F6BF26', row: 1, col: 3 }, // Orange/Yellow
  { id: '5', hex: '#FBBC05', row: 1, col: 4 }, // Yellow
  { id: '2', hex: '#34A853', row: 1, col: 5 }, // Green
  { id: '10', hex: '#0B8043', row: 1, col: 6 }, // Dark Green
  { id: '1', hex: '#4285F4', row: 2, col: 1 }, // Blue (default)
  { id: '7', hex: '#3F51B5', row: 2, col: 2 }, // Indigo/Dark Blue
  { id: '9', hex: '#7986CB', row: 2, col: 3 }, // Light Purple
  { id: '3', hex: '#8E24AA', row: 2, col: 4 }, // Purple
  { id: '8', hex: '#616161', row: 2, col: 5 }, // Gray
];

export default function GoogleColorPicker({ selectedColor, onColorChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  
  // Find color object from hex value
  const currentColor = googleColors.find(c => c.hex === selectedColor) || googleColors[6]; // Default to blue

  // Calculate popup position to stay within boundaries
  const calculatePosition = () => {
    if (!buttonRef.current || !popupRef.current) return { top: '100%', left: '0' };
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = '100%';
    let left = '0';
    
    // Check if popup would extend beyond right edge
    if (buttonRect.left + popupRect.width > viewportWidth) {
      left = `${buttonRect.width - popupRect.width}px`;
    }
    
    // Check if popup would extend beyond bottom edge
    if (buttonRect.bottom + popupRect.height > viewportHeight) {
      top = `${-popupRect.height}px`;
    }
    
    return { top, left };
  };
  
  // Position popup when opened
  useEffect(() => {
    if (isOpen && popupRef.current) {
      const position = calculatePosition();
      popupRef.current.style.top = position.top;
      popupRef.current.style.left = position.left;
    }
  }, [isOpen]);

  // Handle click outside to close popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Color indicator button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select event color"
        className="flex items-center space-x-2 py-1.5 px-2 rounded hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <div
          className="w-5 h-5 rounded-full border border-gray-200"
          style={{ backgroundColor: currentColor.hex }}
        />
        <Palette size={16} className="text-gray-500" />
      </button>

      {/* Color picker popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute z-50 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2 w-[200px]"
          style={{ 
            position: 'absolute',
            animation: "fadeIn 0.15s ease-out"
          }}
        >
          <div className="grid grid-cols-6 gap-2">
            {googleColors
              .filter(color => color.row === 1)
              .map(color => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => {
                    onColorChange(color.hex);
                    setIsOpen(false);
                  }}
                  className="relative w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select color ${color.id}`}
                >
                  {color.hex === currentColor.hex && (
                    <Check size={14} className="absolute inset-0 m-auto text-white" />
                  )}
                </button>
              ))}
          </div>
          
          <div className="grid grid-cols-6 gap-2 mt-2">
            {googleColors
              .filter(color => color.row === 2)
              .map(color => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => {
                    onColorChange(color.hex);
                    setIsOpen(false);
                  }}
                  className="relative w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select color ${color.id}`}
                >
                  {color.hex === currentColor.hex && (
                    <Check size={14} className="absolute inset-0 m-auto text-white" />
                  )}
                </button>
              ))}
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}