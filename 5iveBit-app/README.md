# 5iveBot

5iveBot is an AI-powered assistant for cybersecurity assessment, created by 5iveBit. Its primary objective is to provide expert guidance on various cybersecurity topics, including conversational support, vulnerability information, code analysis, compliance, security assessment, and more.

## Project Setup

### Install dependencies

```bash
$ npm install
```

### Install Ollama

1. Download and install Ollama [from here](https://ollama.com/download)

2. Run the following command to get the base model:

```bash
$ ollama run llama3.2
```

3. Run the following command to get the custom model (required for Cybersecurity assessment):

```bash
$ ollama create 5iveBit-ca-4 -f <location of the file e.g. ./Modelfile>
```

The Modelfile is located at the /5iveBit-app/modelfile directory.

###

### Running the Development build

```bash
$ npm run dev
```

### Running the Production build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

This will create an installer in the app's /dist directory.
