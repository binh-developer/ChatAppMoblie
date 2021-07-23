import {gql} from '@apollo/client';

export const GET_REMINDER = gql`
  query {
    reminder {
      createdAt
      reminderTime
      reminderId
      roomId
      roomName
      title
      userId
    }
  }
`;
