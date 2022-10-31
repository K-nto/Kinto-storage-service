<div align="center">

  <img src="resources/Kintoisologo.png" alt="logo" width="200" height="auto" />
  <h1>Kinto storage service</h1>
  
  <h5>
    UADE Informatics Engineering thesis project - 2022   
  </h5>

  <p>
    Kinto storage service, handles strorage and authentication operations. 
  </p>
   
<h4>
    <a href="https://github.com/K-nto/Kinto-storage-service/">Documentation</a>
  <span> · </span>
    <a href="https://github.com/K-nto/Kinto-storage-service/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/K-nto/Kinto-storage-service/issues/">Request Feature</a>
  </h4>
</div>

<br />

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
- [Setup](#Setup)
  - [Prerequisites](#bangbang-prerequisites)
- [Usage](#eyes-usage)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

## :star2: About the Project

This service manages storage operatiuons, hyperledger blockchain connection, auuthentication and interactions, and IPFS network operations.

### :space_invader: Tech Stack

  <ul>
    <li><a href="https://nodejs.org/">Node</a></li>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://ipfs.tech/">IPFS</a></li>
    <li><a href="https://www.hyperledger.org/use/fabric/">Hyperledger fabric</a></li>
  </ul>

### :dart: Features

- Authenticates users with hyperledger blockchain
- Stoores and retreives files from IPFS network
- Submit operations into hyperledger blockchain

## :toolbox: Setup

### :bangbang: Prerequisites

- **Node** This project uses node and npm as package manager, make sure it is installed.

```bash
 node -v
 npm -v
```

- **ipfs** This project uses IPFS to store files connect to an IPFS network or create your own by running the following command

```bash
jsipfs daemon
```

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file, here it is an example of a localhost configuiration

```bash
PORT=8081

ENV=localhost
CCP_PATH=./org1.example.com/connection-org1.json
WALLET_PATH=./wallet
ADMIN_WALLET=admin
ADMIN_WALLET_SECRET=adminpw
CA_ORG_ID=ca.org1.example.com

IPFS_API=http://127.0.0.1:5001/api/v0
```

## :gear: Usage

Clone the project

```bash
  git clone https://github.com/K-nto/Kinto-network-status-service.git
```

Go to the project directory

```bash
  cd Kinto-network-status-service
```

Install dependencies.

```bash
  npm install
```

Start the service.

```bash
  npm run start
```

## :warning: License

Distributed under the no License. See LICENSE.txt for more information.

<!-- Contact -->

## :handshake: Contact

Federico Javier Parodi - Fedejp - [Linkedin](https://www.linkedin.com/in/fedejp) - [Github](https://github.com/Fedejp)

Carlos Santiago Yanzon - Bizk - [Linkedin](https://www.linkedin.com/in/carlos-santiago-yanzon/) - [Github](https://github.com/bizk)

Project Link: [https://github.com/K-nto](https://github.com/K-nto)

## :gem: Acknowledgements

We thank and aknowledge the authors of these resources for their work.

- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#travel--places)
- [Readme Template](https://github.com/othneildrew/Best-README-Template)
