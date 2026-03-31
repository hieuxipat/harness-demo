import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { increment, decrement, selectCount } from './exampleSlice';
import { Container, Title, Counter, Button } from './ExamplePage.styles';

export const ExamplePage = () => {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <Container>
      <Title>Example Feature</Title>
      <Counter>{count}</Counter>
      <div>
        <Button onClick={() => dispatch(decrement())}>-</Button>
        <Button $primary onClick={() => dispatch(increment())}>+</Button>
      </div>
    </Container>
  );
};
