# Localhost

The version of our proof-of-concept solution to be deployed on the localhost network.

## Requirements
You will need the following tools:

- [Node (v18 LTS)]
- Yarn ([v1] ```npm install --global yarn```)
  
## Getting started

1. Install dependencies
```
yarn install
```

2. Run local network in the first terminal:
```
yarn chain
```
3. In a second terminal, deploy the contracts:
```
yarn deploy
```

4. In a third terminal start your frontend:
``` 
yarn start
```

5. In the second terminal again, run the scenarios:
``` 
yarn scenario1-4 (E.g. scenario1)
```