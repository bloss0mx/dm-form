import React from 'react';

interface props {
  children: React.ReactNode;
}

export default function NoReRender(props: any) {
  return props.children;
}
