import { useState, useEffect } from "react";
import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import QrReader from "react-qr-scanner";

function CheckIn({ connectedContract }) {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedAddress, setScannedAddress] = useState(null);
  const [hasTicket, setHasTicket] = useState(false);
  const [checkInTxnPending, setCheckInTxnPending] = useState(false);
  const toast = useToast();

  console.log('scannedAddress', scannedAddress);

  useEffect(() => {
    const confirmOwnership = async () => {
      try {
        if (!connectedContract) return;
        const res = await connectedContract.confirmOwnership(scannedAddress);

        console.log('ownership res', res);
        
        setHasTicket(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (scannedAddress) {
      confirmOwnership();
    }
  }, [connectedContract, scannedAddress]);

  const checkIn = async () => {
    try {
      if (!connectedContract) return;
      setCheckInTxnPending(true);
      const checkInTxn = await connectedContract.checkIn(scannedAddress);
      await checkInTxn.wait();
      setCheckInTxnPending(false);
      toast({
        status: "success",
        title: "Success!",
        variant: "subtle",
        description: (
          <a
            href={`https://rinkeby.etherscan.io/tx/${checkInTxn.hash}`}
            target='_blank'
            rel='nofollow noreferrer'
          >
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setCheckInTxnPending(false);
      toast({
        status: "error",
        variant: "subtle",
        title: "Failure",
        description: error,
      });
    }
  };

  const handleScan = (data) => {
    if (!data) return;
    console.log(data);
    const address = data.text.split("ethereum:");
    setScannedAddress(address[1]);
    setShowScanner(false);
    toast({
      status: "success",
      variant: "subtle",
      title: "Captured Address!",
      description: `${address[1].slice(0, 6)}...${address[1].slice(-4)}`,
    });
  };

  const handleError = (error) => {
    console.log(error);
    toast({
      status: "error",
      variant: "subtle",
      title: "Failure",
      description: error,
    });
    setShowScanner(false);
  };



  return (
    <>
      <Heading mb={4}>Check In</Heading>
      {!showScanner && scannedAddress && hasTicket && (
        <>
          <Text fontSize='xl' mb={8}>
            This wallet owns a NFTix!
          </Text>
          <Flex width='100%' justifyContent='center'>
            <Button
              isLoading={checkInTxnPending}
              onClick={checkIn}
              size='lg'
              colorScheme='teal'
            >
              Check In
            </Button>
          </Flex>
        </>
      )}
      {!showScanner && (
        <>
          {!scannedAddress && (
            <Text fontSize='xl' mb={8}>
              Scan wallet address to verify ticket ownership and check-in.
            </Text>
          )}
          {scannedAddress && !hasTicket && (
            <Text fontSize='xl' mb={8}>
              This wallet does not own a NFTix. Please try again.
            </Text>
          )}
          {!hasTicket && (
            <Flex width='100%' justifyContent='center'>
              <Button
                onClick={() => setShowScanner(true)}
                size='lg'
                colorScheme='teal'
              >
               Scan QR 
              </Button>
            </Flex>
          )}
        </>
      )}

      {showScanner && (
        <>
          <Box margin='16px auto 8px auto' padding='0 16px' width='360px'>
            <QrReader
              delay={3000}
              style={{ maxWidth: "100%", margin: "0 auto" }}
              onError={handleError}
              onScan={handleScan}
            />
          </Box>
          <Flex width='100%' justifyContent='center'>
            <Button
              onClick={() => setShowScanner(false)}
              size='lg'
              colorScheme='red'
            >
              Cancel
            </Button>
          </Flex>
        </>
      )}
    </>
  );
}

export default CheckIn;
