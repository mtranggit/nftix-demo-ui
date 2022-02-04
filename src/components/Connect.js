import { Button, Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Connect({ address, onConnect, onDisconnect }) {
  const navigate = useNavigate();
  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("ethereum not found");
      return;
    }

    try {
      // accounts is a list of address managed by the metaMask extension
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // we'll take the first one from the list by default
      onConnect(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const disconnectWallet = () => {
    onDisconnect();
    navigate("/");
  };

  return (
    <Flex
      fontWeight='bold'
      position='absolute'
      top='8px'
      right='8px'
      zIndex='10'
    >
      {address && (
        <Box
          bg='white'
          minW='120px'
          p='8px 16px'
          borderRadius='16px'
          marginRight='16px'
          textAlign='center'
        >
          <Button
            size='sm'
            variant='link'
            color='purple'
            onClick={disconnectWallet}
          >
            Disconnect
          </Button>
        </Box>
      )}

      <Box
        bg='white'
        minW='120px'
        p='8px 16px'
        borderRadius='16px'
        textAlign='center'
      >
        {!address && (
          <Button
            size='sm'
            variant='link'
            color='purple'
            onClick={connectWallet}
          >
            Connect
          </Button>
        )}
        {address && (
          <span>
            💳 {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        )}
      </Box>
    </Flex>
  );
}

export default Connect;
