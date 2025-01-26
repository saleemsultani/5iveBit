import { Button } from '@mui/material';
import React from 'react';

function AskUserButtons({ options }) {
  return (
    <>
      {options.map((option, index) => {
        const { label, onclick, color, bgcolor } = option;
        return (
          <Button
            sx={{ backgroundColor: bgcolor,
              color: color,
              margin: '2px',
              transition: 'transform 0.2s ease-in-out', // Smooth transition for hover effect
              '&:hover': {
                transform: 'translateY(-1px)' // Moves the button up slightly
              }}}
            key={index}
            onClick={(e) => {
              if (onclick) {
                onclick(e); // Call the user-defined onClick handler
              }
            }}
          >
            {label}
          </Button>
        );
      })}
    </>
  );
}

export default AskUserButtons;
