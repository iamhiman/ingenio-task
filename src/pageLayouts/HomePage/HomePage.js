import { useEffect, useMemo, useState } from "react";
import styles from "./HomePage.module.css";
import { BsChatLeftText as ChatIcon } from "react-icons/bs";
import { IoMdCall as CallIcon } from "react-icons/io";
import { callStatus, chatStatus, onlineStatus, fetchData } from "../../utilities";
import { Avatar, Button, Card } from "../../components";

export const HomePage = () => {
  const [advisorsData, setAdvisorsData] = useState([]);
  const [advisorsStatus, setAdvisorsStatus] = useState([]);
  const advisorIds = useMemo(() => {
    return advisorsData?.map(advisor => advisor?.id);
  }, [advisorsData]);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const advisors = await fetchData();
        setAdvisorsData(advisors?.data);
      } catch (error) {
        console.error("Error processing advisor data" + error);
        return null;
      }
    };
    fetchAdvisors();
  }, []);

  useEffect(() => {
    const fetchAdvisorsStatus = async () => {
      const updatedStatus = await Promise.all(
        advisorIds.map(async item => {
          try {
            return await fetchData(item);
          } catch (error) {
            console.error(`Error processing advisor ${item} status: ${error.message}`);
            return null;
          }
        })
      );

      setAdvisorsStatus(updatedStatus);
    };

    const intervalId = setInterval(fetchAdvisorsStatus, 30000);
    return () => clearInterval(intervalId);
  }, [advisorIds]);

  const onButtonClick = () => {
    console.log("hello");
  };

  const checkOnlineStatus = (advisor, index) => {
    let callStatus = advisorsStatus.length
      ? advisorsStatus?.[index]?.["call-availability"] === onlineStatus.ONLINE
      : advisor?.["call-availability"] === onlineStatus.ONLINE;
    let chatStatus = advisorsStatus.length
      ? advisorsStatus?.[index]?.["chat-availability"] === onlineStatus.ONLINE
      : advisor?.["chat-availability"] === onlineStatus.ONLINE;

    return { callStatus, chatStatus };
  };

  if (!advisorsData.length) {
    return (
      <main className={styles.pageLayout}>
        <article className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </article>
      </main>
    );
  }

  return (
    <main className={styles.pageLayout}>
      <h3 className={styles.pageHeading}>Advisor Availability</h3>
      {advisorsData?.map((advisor, index) => {
        let onlineStatus = checkOnlineStatus(advisor, index);
        return (
          <Card key={advisor?.id} cssStyles={`${advisorsData.length - 1 !== index && styles.cardBorderBottom}`}>
            <div className={styles.cardLeftContent}>
              <Avatar imageUrl={advisor?.profilePictureUrl} imageText="userImage" loading="lazy" />
              <p className={styles.name}>{advisor?.title}</p>
            </div>
            <div className={styles.cardRightContent}>
              <p className={styles.priceTag}>
                ${advisor?.pricePerMinute}
                <span className={styles.priceTagPerMinute}>/min</span>
              </p>
              <Button
                onButtonClick={onButtonClick}
                cssStyles={`${onlineStatus?.callStatus ? styles.online : styles.offline}`}
                buttonText={
                  <>
                    <CallIcon className={styles.icon} />
                    <span>{onlineStatus?.callStatus ? callStatus.CALL_NOW : callStatus.CALL_LATER}</span>
                  </>
                }
              />
              <Button
                onButtonClick={onButtonClick}
                cssStyles={`${onlineStatus?.chatStatus ? styles.online : styles.offline}`}
                buttonText={
                  <>
                    <ChatIcon className={styles.icon} />
                    <span>{onlineStatus?.chatStatus ? chatStatus.CHAT_NOW : chatStatus.CHAT_LATER}</span>
                  </>
                }
              />
            </div>
          </Card>
        );
      })}
    </main>
  );
};
