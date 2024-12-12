import { Box, Button, Stack } from "@mui/material";
// import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import Textarea from "@mui/joy/Textarea";
import { useChats } from "./contexts/ChatContext.jsx";

// const data = [
//   "Nice-looking stat cards that rotate when you hover over them to save space on your dashboard and make things more awesome. There are bright backgrounds on the front of the card that make the numbers that are most important to you stand out. There is a useful bar chart on the back of the card. Made using Shadcn UI components.",
//   "Nice-looking stat cards that rotate when you hover over them to save space on your dashboard and make things more awesome. There are bright backgrounds on the front of the card that make the numbers that are most important to you stand out. There is a useful bar chart on the back of the card. Made using Shadcn UI components."
// ];

function ChatBox() {
  const { currChat, setCurrChat, question, setQuestion } = useChats();

  const handleSubmitQuestion = () => {
    setQuestion("");

    setCurrChat((curr) => {
      const newQuestions = [...curr.questions, question];
      const newAnswers = [...curr.answers, `${curr.questions.length}: here is your random answer`];

      return {
        ...curr,
        questions: newQuestions,
        answers: newAnswers
      };
    });
  };

  return (
    <>
      <Box
        flex={80}
        sx={{
          display: "flex",
          gap: 5,
          flexDirection: "column"
          //   border: "solid white 1px",
        }}
      >
        <Box
          sx={{
            height: "90%",
            // border: "solid white 1px",
            borderRadius: "20px",
            bgcolor: "#212121",
            overflowY: "scroll",
            display: "flex",

            flexDirection: "column"
          }}
        >
          {currChat.questions?.map((item, index) => {
            return (
              <>
                <p
                  key={index}
                  style={{
                    //   alignSelf: index % 2 === 0 ? "flex-end" : "flex-start",
                    alignSelf: "flex-end",
                    marginLeft: "50px",
                    marginRight: "50px",
                    // gap: "10",
                    width: "50%",
                    padding: "5px",
                    // border: "solid white 1px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    backgroundColor: "#57575b",
                    borderRadius: "10px"
                  }}
                >
                  {item}
                </p>
                <p
                  key={index + 1}
                  style={{
                    //   alignSelf: index % 2 === 0 ? "flex-end" : "flex-start",
                    alignSelf: "flex-start",
                    marginLeft: "50px",
                    marginRight: "50px",
                    width: "50%",
                    padding: "5px",
                    //   border: "solid white 1px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    backgroundColor: "#57575b",
                    borderRadius: "10px"
                  }}
                >
                  {currChat.answers[index]}
                </p>
              </>
            );
          })}
        </Box>
        {/* here is the searh */}
        <Box>
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            multiline
            placeholder="Search 5iveBot"
            maxRows={3}
            sx={{
              bgcolor: "#212121",
              border: "solid 1px black",
              borderRadius: "10px",
              color: "white"
            }}
            endDecorator={
              <Stack
                direction="row"
                // gap={}
                width="100%"
                justifyContent="flex-end"
              >
                <Button sx={{ color: "white" }}>
                  <GraphicEqIcon />
                </Button>
                <Button
                  onClick={handleSubmitQuestion}
                  disabled={question === ""}
                  sx={{ color: "white" }}
                >
                  <SendIcon />
                </Button>
              </Stack>
            }
          />
        </Box>
        {/* end of search */}
      </Box>
    </>
  );
}

export default ChatBox;
