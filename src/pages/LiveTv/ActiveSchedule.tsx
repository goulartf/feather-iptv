import React, {useContext, useEffect, useState} from 'react';
import {DateTime} from "luxon";
import {ScheduleContext} from "../../Contexts";

export default function ActiveSchedule({channelId}: any) {
  const {schedules} = useContext(ScheduleContext);
  const [active, setActive] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const data = async () => {
      const active = schedules[channelId] && schedules[channelId].find((item: any) => {
        const dateStart = DateTime.fromFormat(item.attributes.start, "yyyyMMddHHmmss ZZZ").toMillis()
        const dateEnd = DateTime.fromFormat(item.attributes.stop, "yyyyMMddHHmmss ZZZ").toMillis()
        const dateNow = DateTime.local().toMillis();
        return dateNow >= dateStart && dateNow <= dateEnd;
      });


      setLoading(false);
      if (!active) return;

      const dateStart = DateTime.fromFormat(active.attributes.start, "yyyyMMddHHmmss ZZZ");
      const dateEnd = DateTime.fromFormat(active.attributes.stop, "yyyyMMddHHmmss ZZZ");
      const dateNow = DateTime.local();

      const total = (dateEnd.toMillis() - dateStart.toMillis());
      const timeElapsedPercentage = (((dateNow.toMillis() - dateStart.toMillis()) * 100) / total).toFixed(2);

      const title = active.children[0].value;

      setActive({title, dateStart, dateEnd, timeElapsedPercentage});
    }

    data();
  }, []);

  return (
    <>
      {loading && <h1>Loading…</h1>}

      {!loading && active && <div>
          <h2>{`${active.title}`}</h2>
          <div className="h-1 w-full bg-gray-500 mt-2">
              <div className="h-1 bg-gray-100" style={{width: `${active.timeElapsedPercentage}%`}}></div>
          </div>
      </div>
      }

      {
        !loading && !active && <h2>Schedule not available</h2>
      }

    </>
  );
}
