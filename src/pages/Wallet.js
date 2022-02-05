import { useEffect, useState } from "react";
import {
  CircularProgress,
  Flex,
  Link,
  Box,
  Image,
  Heading,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

function Wallet({ address }) {
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticket, setTicket] = useState(null);

  const createTicketDisplay = () => {
    if (!ticket) return null;
    // const ticket = {
    //   token_id: 1,
    //   permalink:
    //     "https://rinkeby.rarible.com/token/0xc35f64eeea3446518fb037e50ffa58e7b9a5771d:1?tab=history",
    //   image_url:
    //     "https://rarible.mypinata.cloud/ipfs/Qmb5QKv979PZsYuXLWiEVqXPJakFXCmEEzpzqnCRfSqvLC",
    // };
    // const ticket = {
    //   token_id: 1,
    //   permalink:
    //     "https://rinkeby.rarible.com/token/0x8f510afccb7a50181dfe95b803443070ded8ba1d:1?tab=history",
    //   image_url:
    //     "https://rarible.mypinata.cloud/ipfs/Qmd8FCbr5eiFcrSzj3PRovG61tVeus3HJzT3B46XXaJmWj",
    // };
    return (
      <Link
        href={ticket.permalink}
        key={ticket.token_id}
        isExternal
        width='100%'
        margin='16px 8px'
      >
        <Text fontSize='xl' textAlign='center' mb={2}>
          NFTix #{ticket.token_id}
        </Text>
        <Box padding='12px' border='1px solid black' borderRadius='12px'>
          <Image src={ticket.image_url} alt={`NFTix #${ticket.token_id}`} />
        </Box>
      </Link>
    );
  };
  useEffect(() => {
    if (!address) return;
    setLoadingTicket(true);
    axios
      .get(
        `https://rinkeby-api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=${process.env.REACT_APP_CONTRACT_ID}`
      )
      .then((res) => {
        console.log(res);
        if (
          res.status === 200 &&
          res?.data?.assets &&
          res?.data?.assets.length
        ) {
          console.log(res.data.assets[0]);
          setTicket(res.data.assets[0]);
        }
        setLoadingTicket(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingTicket(false);
      });
  }, [address]);
  return (
    <>
      <Heading mb={4}>Your ticket</Heading>
      <Flex justifyContent='center' mb={8}>
        {loadingTicket && (
          <CircularProgress
            capIsRound
            isIndeterminate
            color='green.300'
            size='120px'
          />
        )}
        {!loadingTicket && ticket && createTicketDisplay()}
        {!loadingTicket && !ticket && (
          <Text fontSize='xl' mb={2} width='100%'>
            You don't own any tickets 😢
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Wallet;
