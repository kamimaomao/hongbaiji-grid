import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('lets a user add a signature and select a game into the first slot', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('署名'), '阿明');
    expect(screen.getByText('阿明最喜欢的红白机游戏')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '选择第 1 个红白机游戏' }));
    expect(screen.getByRole('dialog', { name: '选择红白机游戏' })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('搜索中文名、英文名或别名'), '魂斗罗');
    await user.click(screen.getByRole('button', { name: /选择 魂斗罗/ }));

    const firstSlot = screen.getByTestId('grid-slot-0');
    expect(within(firstSlot).getByText('魂斗罗')).toBeInTheDocument();
  });

  it('keeps generate disabled until all 9 slots are filled', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: '选满 9 个后生成' })).toBeDisabled();
  });

  it('does not allow the same game to be selected twice', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '选择第 1 个红白机游戏' }));
    await user.type(screen.getByPlaceholderText('搜索中文名、英文名或别名'), '魂斗罗');
    await user.click(screen.getByRole('button', { name: '选择 魂斗罗' }));

    await user.click(screen.getByRole('button', { name: '选择第 2 个红白机游戏' }));
    await user.type(screen.getByPlaceholderText('搜索中文名、英文名或别名'), '魂斗罗');

    expect(screen.getByRole('button', { name: '已选择 魂斗罗' })).toBeDisabled();
  });
});
