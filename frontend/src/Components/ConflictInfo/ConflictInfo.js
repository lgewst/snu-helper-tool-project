import React from 'react';

const ConflictInfo = (conflictList) => {
  console.log(conflictList);

  return (
    <div>
      <table>
        <tr>
          <th></th>
        </tr>
        <td></td>
      </table>
      <div className="fileList">
        {conflictList.map((conflict) => (
          <div key={conflict.id}>
            {conflict.id}

            {conflict.code.map((code) => (
              <div key={code.line}>
                {code.line} {code.content}
              </div>
            ))}

            {conflict.blame.map((blame) => (
              <div key={blame.content + blame.line_start}>{blame.content}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictInfo;
