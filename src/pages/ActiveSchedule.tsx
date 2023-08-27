import React, {useContext, useEffect, useState} from 'react';
import {DateTime} from "luxon";
import {ScheduleContext} from "../Contexts";

export default function ActiveSchedule({channelId}: any) {
  const {schedules} = useContext(ScheduleContext);
  const [active, setActive] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const data = async () => {
      setActive(
        schedules[channelId] && schedules[channelId].find((item: any) => {
          const dateStart = DateTime.fromFormat(item.attributes.start, "yyyyMMddHHmmss ZZZ").toMillis()
          const dateEnd = DateTime.fromFormat(item.attributes.stop, "yyyyMMddHHmmss ZZZ").toMillis()
          const dateNow = DateTime.local().toMillis();
          return dateNow >= dateStart && dateNow <= dateEnd;
        })
      );
      setLoading(false);
    }

    data();
  }, []);

  return (
    <>
      {loading && <h1>Loading…</h1>}

      {
        !loading && active && <h2>{`
        ${DateTime.fromFormat(active.attributes.start, "yyyyMMddHHmmss ZZZ", {locale: "pt-br"}).toLocaleString(DateTime.TIME_24_SIMPLE)}
          -
        ${DateTime.fromFormat(active.attributes.stop, "yyyyMMddHHmmss ZZZ", {locale: "pt-br"}).toLocaleString(DateTime.TIME_24_SIMPLE)}
        ${active.children[0].value}`}
        </h2>
      }

      {
        !loading && !active && <h2>Schedule not available</h2>
      }

    </>
  );
}
