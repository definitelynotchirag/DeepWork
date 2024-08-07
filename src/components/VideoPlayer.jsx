import { useEffect, useRef } from 'react';
import { Card, Text, Container, AspectRatio, Paper } from '@mantine/core';

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    if (user.videoTrack && ref.current) {
      user.videoTrack.play(ref.current);
    }
  }, [user.videoTrack]);

  return (
    <Container padding="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <AspectRatio ratio={10 / 9} style={{ width: '100%', height: 'auto' }}>
            <Paper padding="md" style={{ height: '100%' }}>
              <div
                ref={ref}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000', // Fallback color for better visibility
                }}
              ></div>
            </Paper>
          </AspectRatio>
        </Card.Section>
        <Text size="sm" align="center" mt="md">
          User ID: {user.uid}
        </Text>
      </Card>
    </Container>
  );
};
