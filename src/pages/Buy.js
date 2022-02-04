import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";

function Buy({ connectedContract }) {
  const [totalTicketCount, setTotalTicketCount] = useState(null);
  const [availableTicketCount, setAvailableTicketCount] = useState(null);
  const [buyTxnPending, setBuyTxnPending] = useState(false);
  const toast = useToast();

  console.log("totalTicketCount", totalTicketCount);
  console.log("availableTicketCount", availableTicketCount);

  useEffect(() => {
    if (!connectedContract) return;
    const getTotalTicketCount = async () => {
      try {
        const count = await connectedContract.totalTicketCount();
        setTotalTicketCount(count.toNumber());
      } catch (error) {
        console.log(error);
      }
    };

    const getAvailableTicketCount = async () => {
      try {
        const count = await connectedContract.availableTicketCount();
        setAvailableTicketCount(count.toNumber());
      } catch (error) {
        console.log(error);
      }
    };
    getAvailableTicketCount();
    getTotalTicketCount();
  });

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;
      setBuyTxnPending(true);
      const buyTxn = await connectedContract.mint({
        value: `${0.0008 * 10 ** 18}`,
      });
      await buyTxn.wait();
      setBuyTxnPending(false);
      toast({
        status: "success",
        title: "Success",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${buyTxn.hash}`}
            rel='nofollow noreferrer'
            target='_blank'
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setBuyTxnPending(false);
      toast({
        status: "error",
        title: "Failure",
        description: error.message,
        variant: "subtle",
      });
    }
  };

  return (
    <>
      <Heading mb={4}>DevDAO Conference 2022</Heading>
      <Text fontSize='xl' mb={4}>
        Connect your wallet to mint your NFT. It'll be your ticket to get in!
      </Text>
      <Flex
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        margin='0 auto'
        maxW='140px'
      >
        <ButtonGroup mb={4}>
          <Button
            onClick={buyTicket}
            isLoading={buyTxnPending}
            loadingText='Pending'
            size='lg'
            colorScheme='teal'
          >
            Buy Ticket
          </Button>
        </ButtonGroup>
        {availableTicketCount && totalTicketCount && (
          <Text>
            {availableTicketCount} of {totalTicketCount} minted!
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Buy;
