import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

function Admin({ isOwner, connectedContract }) {
  const toast = useToast();
  const [openSaleTxnIsPending, setOpenSaleTxnIsPending] = useState(false);
  const [closeSaleTxnIsPending, setCloseSaleTxnIsPending] = useState(false);

  const openSale = async () => {
    try {
      if (!connectedContract) return;
      setOpenSaleTxnIsPending(true);
      let openSaleTxn = await connectedContract.openSale();
      await openSaleTxn.wait();
      setOpenSaleTxnIsPending(false);
      toast({
        status: "success",
        title: "Sale is open",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${openSaleTxn.hash}`}
            rel='nofollow noreferrer'
            target='_blank'
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setOpenSaleTxnIsPending(false);
      toast({
        status: "error",
        title: "Failure",
        description: error.message,
        variant: "subtle",
      });
    }
  };

  const closeSale = async () => {
    try {
      if (!connectedContract) return;
      setCloseSaleTxnIsPending(true);
      let closeSaleTxn = await connectedContract.closeSale();
      await closeSaleTxn.wait();
      setCloseSaleTxnIsPending(false);
      toast({
        status: "success",
        title: "Sale is closed!",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${closeSaleTxn.hash}`}
            rel='nofollow noreferrer'
            target='_blank'
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setCloseSaleTxnIsPending(false);
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
      <Heading mb={4}>Admin panel</Heading>
      <Text fontSize='xl' mb={8}>
        Enable and disable sales on the smart contract.
      </Text>
      <Flex width='100%' justifyContent='center'>
        <Button
          size='lg'
          colorScheme='teal'
          isLoading={openSaleTxnIsPending}
          isDisabled={!isOwner || closeSaleTxnIsPending}
          onClick={openSale}
        >
          Open Sale
        </Button>
        <Button
          size='lg'
          colorScheme='red'
          isLoading={closeSaleTxnIsPending}
          variant='solid'
          marginLeft='24px'
          isDisabled={!isOwner || openSaleTxnIsPending}
          onClick={closeSale}
        >
          Close Sale
        </Button>
      </Flex>
    </>
  );
}

export default Admin;
