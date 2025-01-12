import { Button } from '@mui/material';
import React from 'react';

function askUserButtons({ options }) {
  return (
    <>
      {options.map((option, index) => {
        const { label, onclick, color, bgcolor } = option;
        return (
          <Button
            sx={{ backgroundColor: bgcolor, color: color }}
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

export default askUserButtons;
