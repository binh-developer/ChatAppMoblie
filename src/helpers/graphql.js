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

export const CREATE_REMINDER = gql`
  mutation CreateReminder(
    $userId: String!
    $title: String!
    $roomId: String!
    $roomName: String!
    $reminderTime: Float!
  ) {
    createReminder(
      userId: $userId
      title: $title
      roomId: $roomId
      roomName: $roomName
      reminderTime: $reminderTime
    ) {
      status
    }
  }
`;

export const REMOVE_REMINDER = gql`
  mutation RemoveReminder($reminderId: String!) {
    removeReminder(reminderId: $reminderId) {
      status
    }
  }
`;

export const UPDATE_REMINDER = gql`
  mutation UpdateReminder(
    $reminderId: String!
    $title: String!
    $reminderTime: Float!
  ) {
    updateReminder(
      reminderId: $reminderId
      title: $title
      reminderTime: $reminderTime
    ) {
      status
    }
  }
`;
